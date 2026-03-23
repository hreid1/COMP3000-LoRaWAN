from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from pathlib import Path
from sklearn.metrics import silhouette_score, accuracy_score, precision_score, recall_score, f1_score
import joblib
import shap

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

    def preprocess(uploaded_file):
        # Load and preprocess uploaded file
        df = pd.read_csv(uploaded_file)
        df.columns = df.columns.str.strip()
        df = df.dropna()
        
        # Load training data to fit scaler
        datasets_dir = Path(__file__).resolve().parent / "datasets"
        train_df = pd.read_csv(datasets_dir / "no-jammer.csv")
        train_df.columns = train_df.columns.str.strip()
        train_df = train_df.dropna()
        
        # Scale data
        scaler = StandardScaler()
        scaler.fit(train_df[MLModelService.anomaly_inputs])
        df_scaled = scaler.transform(df[MLModelService.anomaly_inputs])
        
        return df_scaled, df
    
    def predict(model, test_scaled):
        predictions = model.predict(test_scaled)
        scores = model.decision_function(test_scaled)
        
        return predictions, scores
    
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

    def explainModel(model, test_scaled):
        explainer = shap.TreeExplainer(model)
        start_index = 1
        end_index = 2
        shap_values = explainer.shap_values(test_scaled[start_index:end_index])
        print(shap_values[0].shape)

        return shap_values
    
    def getZscores(test_scaled, aomaly_inputs, threshold=2.5):
        mean = test_scaled.mean()
        std = test_scaled.std()

        z_scores = np.abs((test_scaled - mean) / (std + 1e-8))
        
    
    def run(uploaded_file, model_type='IsolationForest'):
        df_scaled, df = MLModelService.preprocess(uploaded_file)
        
        models_dir = Path(__file__).resolve().parent / "models"
        
        if model_type == 'IsolationForest':
            model = joblib.load(models_dir / "isolationforest.pkl")
            model_name = "Isolation Forest"
            
        else:
            model = joblib.load(models_dir / "localoutlierfactor.pkl")
            model_name = "Local Outlier Factor"
        
        predictions, scores = MLModelService.predict(model, df_scaled)
        performance = MLModelService.getPerformance(model, df_scaled, predictions, scores, df)
        
        return {
            "success": "success",
            "performance": performance,
            "model info": {
                "model": model_name
            },
            "file name": Path(uploaded_file.name).name,
            "num_packets": len(df),
        }
