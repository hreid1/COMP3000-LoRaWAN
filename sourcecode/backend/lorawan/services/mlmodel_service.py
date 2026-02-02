from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from pathlib import Path
from sklearn.metrics import silhouette_score, accuracy_score, precision_score, recall_score, f1_score

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
    anomaly_inputs = [
        'SF', 'CF', 'TX', 'BW', 'CR', 'SNR', 'RSSI', 'PktSeqNum',
        'payloadSize', 'numReceivedPerNode[nodeNumber-1]', 'PDRPerNode'
    ]

    def preprocess(uploaded_file):
        # Load uploaded file
        df = pd.read_csv(uploaded_file)

        # Loading training data
        base_dir = Path(__file__).resolve().parent.parent
        data_dir = base_dir / "datasets"
        normal_path = data_dir / "no-jammer.csv"
        if not normal_path.exists():
            raise FileNotFoundError(f"Dataset not found: {normal_path}")
        train_df = pd.read_csv(normal_path)
        
        # Preprocessing training and testing data
        df = df.dropna()
        train_df = train_df.dropna()
        scaler = StandardScaler()
        train_scaled = scaler.fit_transform(train_df[MLModelService.anomaly_inputs])
        df_scaled = scaler.transform(df[MLModelService.anomaly_inputs])

        return df_scaled, train_scaled, df
    
    def runIsoaltionForest(train_scaled):
        contamination = 0.01
        random_state = 42
        n_estimators = 200
        model = IsolationForest(contamination=contamination, random_state=random_state, n_estimators=n_estimators, max_samples='auto')
        model.fit(train_scaled)
        model_name = "Isolation Forest"

        return model, model_name

    def runLocalOutlierFactor(train_scaled):
        n_neighbors = 20
        contamination = 0.01
        model = LocalOutlierFactor(n_neighbors=n_neighbors, contamination=contamination, novelty=True)
        model.fit(train_scaled)
        model_name = "Local Outlier Factor"

        return model, model_name

    def runAutoencoder(processed_file):
        return 0
    
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
    
    def run(uploaded_file):
        df_scaled, train_scaled, df = MLModelService.preprocess(uploaded_file)
        #model = MLModelService.runIsoaltionForest(train_scaled)
        model, model_name = MLModelService.runLocalOutlierFactor(train_scaled)
        predictions, scores = MLModelService.predict(model, df_scaled)
        performance = MLModelService.getPerformance(model, df_scaled, predictions, scores, df)
        
        return {
            "success": "success",
            "performance": performance,
            "model info": {
                "model": model_name
            },
            "file name": Path(uploaded_file.name).name
        }
