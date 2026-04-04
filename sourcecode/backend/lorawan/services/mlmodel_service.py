from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from pathlib import Path
from sklearn.metrics import silhouette_score, accuracy_score, precision_score, recall_score, f1_score
from sklearn.feature_selection import SelectKBest, f_classif
import joblib
import shap
import os
import joblib

# Running each of the models
    # Runng the model on the processed input file
    # Getting the results of running the model:
        # accuracy, precision, f1_score, recall
        # num of anomalies in dataset, type of anomaly (set characteristics e.g. lots of packets coming from one place could suggest DDOS)
    # Add model + results to DB
        # Convert from queryset to dataframe
        # Packet
        # Anomaly
class MLModelService:
    # Removed CR, BW, TX, payloadSize, pdrPerNodePerWindow
    anomaly_inputs = [
        'SF', 'CF', 'SNR', 'RSSI', 'PktSeqNum',
        'numReceivedPerNode[nodeNumber-1]', 'PDRPerNode', 
        'numReceivedPerNodePerWindow[nodeNumber]', 'currentSeqNum',
        'lastSeqNumAtWindowStart[nodeNumber]',
        'interArrivalTime_s', 'interArrivalTimeMin',
    ]

    @staticmethod
    def creatingModels():
        # check if models exist before
        # loading training data
        # preprocess: scaling, dropping rows
        # select parameters for isolation forest and local outlier factor
        # create using joblib
        anomaly_inputs = MLModelService.anomaly_inputs
        
        datasets_dir = Path(__file__).resolve().parent / "datasets"
        models_dir = Path(__file__).resolve().parent / "models"

        models = [
            models_dir / "isolationforest.pkl",
            models_dir / "localoutlierfactor.pkl",
            models_dir / "scaler.pkl"
        ]

        for model_file in models:
            if model_file.exists():
                os.remove(model_file)
        models_dir.mkdir(exist_ok=True)

        df = pd.read_csv(datasets_dir / "no-jammer.csv")
        df.columns = df.columns.str.strip()
        df = df.dropna()
        scaler = StandardScaler()
        df_scaled = scaler.fit_transform(df[anomaly_inputs])
        joblib.dump(scaler, models_dir / "scaler.pkl")
        
        contamination = 0.05

        isolationforest = IsolationForest(contamination=contamination, random_state=42, n_estimators=500, max_samples=128, max_features=0.8)
        isolationforest.fit(df_scaled)
        joblib.dump(isolationforest, models_dir / "isolationforest.pkl")

        localoutlierfactor = LocalOutlierFactor(contamination=contamination, n_neighbors=20, algorithm="auto", leaf_size=30, novelty=True)
        localoutlierfactor.fit(df_scaled)
        joblib.dump(localoutlierfactor, models_dir / "localoutlierfactor.pkl")
        
    @staticmethod
    def preprocess(uploaded_file):
        # Load and preprocess uploaded file
        df = pd.read_csv(uploaded_file)
        df.columns = df.columns.str.strip()
        df = df.dropna()
        
        # Load fitted scaler
        models_dir = Path(__file__).resolve().parent / "models"
        scaler_path = models_dir / "scaler.pkl"
        
        if not scaler_path.exists():
             MLModelService.creatingModels()
             
        scaler = joblib.load(scaler_path)
        df_scaled = scaler.transform(df[MLModelService.anomaly_inputs])
        
        return df_scaled, df
    
    @staticmethod
    def predict(model, test_scaled):
        predictions = model.predict(test_scaled)
        scores = model.decision_function(test_scaled)
        
        return predictions, scores
    
    @staticmethod
    def getPerformance(model, test_scaled, predictions, scores, df_original):
        # unsupervised performance evaluation
        predictions_binary = (predictions == -1).astype(int)

        performance = {
            "anomaly_count": int(np.sum(predictions_binary)),
            "anomaly_percentage": float((np.sum(predictions_binary) / len(predictions_binary)) * 100),
            "silhouette_score": float(silhouette_score(test_scaled, predictions_binary)),

            "anomaly_scores": {
                "mean": float(scores[predictions == -1].mean()),
                "std": float(scores[predictions == -1].std()),
                "min": float(scores[predictions == -1].min()),
                "max": float(scores[predictions == -1].max()),
            }
        }

        # Supervised learning metrics
            # For jammer.csv assigning columns with node121 as anomaly
        if df_original is not None:
            if 'NodeID' in df_original.columns:
                y_true = (df_original['NodeID'] == 121).astype(int)
            else:
                y_true = None
            if y_true is not None:
                performance["supervised_metrics"] = {
                    "accuracy": float(accuracy_score(y_true, predictions_binary)),
                    "precision": float(precision_score(y_true, predictions_binary)),
                    "recall": float(recall_score(y_true, predictions_binary)),
                    "f1_score": float(f1_score(y_true, predictions_binary))
                }
        
        return performance 

    @staticmethod
    def explainModel(model, test_scaled):
        explainer = shap.TreeExplainer(model)
        start_index = 1
        end_index = 2
        shap_values = explainer.shap_values(test_scaled[start_index:end_index])
        print(shap_values[0].shape)

        return shap_values
    
    @staticmethod
    def getZscores(test_scaled, aomaly_inputs, threshold=2.5):
        return 0
        
    
    @staticmethod
    def run(uploaded_file, model_type='IsolationForest'):
        df_scaled, df = MLModelService.preprocess(uploaded_file)
        
        # Check if models exist, if not create them
        models_dir = Path(__file__).resolve().parent / "models"
        isolationforest_path = models_dir / "isolationforest.pkl"
        localoutlierfactor_path = models_dir / "localoutlierfactor.pkl"
        
        # Create models if they don't exist
        if not isolationforest_path.exists() or not localoutlierfactor_path.exists():
            MLModelService.creatingModels()
        
        if model_type == 'IsolationForest':
            model = joblib.load(isolationforest_path)
            model_name = "Isolation Forest"
            
        else:
            model = joblib.load(localoutlierfactor_path)
            model_name = "Local Outlier Factor"
        
        predictions, scores = MLModelService.predict(model, df_scaled)
        performance = MLModelService.getPerformance(model, df_scaled, predictions, scores, df)

        # Get anomaly indices (where predictions == -1 for Isolation Forest/LOF)
        anomaly_indices = np.where(predictions == -1)[0].tolist()
        anomaly_scores = scores[predictions == -1].tolist()
        
        return {
            "success": "success",
            "performance": performance,
            "model info": {
                "model": model_name
            },
            "file name": Path(uploaded_file.name).name,
            "num_packets": len(df),
            "predictions": predictions.tolist(),  # Add predictions
            "anomaly_indices": anomaly_indices,   # Add anomaly indices
            "anomaly_scores": anomaly_scores,     # Add anomaly scores
        }
