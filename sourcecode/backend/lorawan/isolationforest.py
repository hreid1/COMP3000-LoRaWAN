import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler
from pathlib import Path

# Models to be used: 
    # Isolation Forest, 
    # One-Class SVM, 
    # Autoencoders, 
    # KNN/LOF

# Goals:
    # Data from csv needs to be stored in database
    # The evaluation needs to incorporate more than one model (e.g. Isolation forest said this packet was an anomaly, but LOF said it wasn't)
    # Currently the model is trained on the data every-time its ran -> MAYBE CHANGE THIS
    # Add endpoints to retrain, update and track model versions
    # Predict on single packets, not just batch CSV

# Process: 
    # User inputs csv file
    # User picks model
    # Application runs choices 
    # Application returns performance_metrics: accuracy

# anomaly_inputs
    # NodeID
    # MAC
    # SF
    # CF
    # TX
    # BW
    # CR
    # SNR
    # RSSI
    # PktSeqNum
    # payload
    # payloadSize
    # numReceivedPerNode[nodeNumber-1]
    # PDRPerNode
    # numReceivedPerNodePerWindow[nodeNumber]
    # currentSeqNum
    # lastSeqNumAtWindowStart[nodeNumber]
    # pdrPerNodePerWindow[nodeNumber]
    # interArrivalTime_s
    # interArrivalTimeMin

def preprocessing():


    return 0

def runModel(custom_df=None):
    anomaly_inputs = [
        'SF', 'CF', 'TX', 'BW', 'CR', 'SNR', 'RSSI', 'PktSeqNum',
        'payloadSize', 'numReceivedPerNode[nodeNumber-1]', 'PDRPerNode'
    ]

    # If a custom DataFrame is provided, use it for prediction
    if custom_df is not None:
        # Load and fit scaler/model on your normal data
        base_dir = Path(__file__).resolve().parent
        data_dir = base_dir / "datasets"
        normal_path = data_dir / "no-jammer.csv"
        if not normal_path.exists():
            raise FileNotFoundError(f"Dataset not found: {normal_path}")
        normal = pd.read_csv(normal_path).dropna()
        scaler = StandardScaler()
        normal_scaled = scaler.fit_transform(normal[anomaly_inputs])

        # Train model on normal data
        IF = IsolationForest(contamination=0.001, random_state=42)
        IF.fit(normal_scaled)

        # Predict on uploaded data
        try:
            custom_scaled = scaler.transform(custom_df[anomaly_inputs])
        except Exception as e:
            return {"error": f"Uploaded file missing required columns: {e}"}
        preds = IF.predict(custom_scaled)
        scores = IF.decision_function(custom_scaled)
        topNode = None
        topNodeAnomaly = 0

        if "NodeID" in custom_df.columns:
            anomaly = (preds == -1)

            anomaliesPerNode = (
                custom_df.loc[anomaly]
                .groupby("NodeID")
                .size()
            )

            if not anomaliesPerNode.empty:
                topNode = anomaliesPerNode.idxmax()
                topNodeAnomalies = int(anomaliesPerNode.max())

        if "NodeID" in custom_df.columns:
            custom_df = custom_df.copy()
            custom_df['is_anomaly'] = (custom_df['NodeID'] == 121).astype(int)
            prediction = (preds == -1).astype(int)
            y_true = custom_df['is_anomaly']
            num_anomalies = (preds == -1).sum()
            acc = accuracy_score(y_true, prediction)
        else:
            acc = None

        return {
            "predictions": preds.tolist(),
            "anomaly_scores": scores.tolist(),
            "n_rows": len(custom_df),
            "accuracy": acc,
            "num_anomalies": num_anomalies,
            "top_anomaly_node": topNode,
            "top_anomaly_node_anomalies": topNodeAnomalies,
        }

    # Otherwise run the default
    base_dir = Path(__file__).resolve().parent
    data_dir = base_dir / "datasets"
    normal_path = data_dir / "no-jammer.csv"
    jammer_path = data_dir / "jammer.csv"

    if not normal_path.exists() or not jammer_path.exists():
        raise FileNotFoundError(f"Dataset not found. expected: {normal_path} and {jammer_path}")

    normal = pd.read_csv(normal_path).dropna()
    jammer = pd.read_csv(jammer_path).dropna()

    scaler = StandardScaler()
    normal_scaled = scaler.fit_transform(normal[anomaly_inputs])
    jammer_scaled = scaler.transform(jammer[anomaly_inputs])

    IF = IsolationForest(contamination=0.001, random_state=42)
    IF.fit(normal_scaled)

    jammer['anomaly_scores'] = IF.decision_function(jammer_scaled)
    jammer['anomaly'] = IF.predict(jammer_scaled)
    jammer['is_anomaly'] = (jammer['NodeID'] == 121).astype(int)
    prediction = (jammer['anomaly'] == -1).astype(int)
    y_true = jammer['is_anomaly']
    acc = accuracy_score(y_true, prediction)

    return {
        "accuracy": acc,
    }