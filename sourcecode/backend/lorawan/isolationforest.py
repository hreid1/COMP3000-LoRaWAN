import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler

def runModel():

    # Load datasets
    normal = pd.read_csv("../../datasets/normal_dataset.csv")
    jammer = pd.read_csv("../../datasets/jammer_dataset.csv")

    # Drop rows
    normal = normal.dropna()
    jammer = jammer.dropna()

    # Columns to extract
    anomaly_inputs = ['SF', 'CF', 'TX', 'BW', 'CR', 'SNR', 'RSSI', 'PktSeqNum', 'payloadSize', 'numReceivedPerNode[nodeNumber-1]', 'PDRPerNode']

    # Scales normal + jammer data for better results
    scaler = StandardScaler()
    normal_scaled = scaler.fit_transform(normal[anomaly_inputs])
    jammer_scaled = scaler.transform(jammer[anomaly_inputs])

    # Parameters for Isolation Forest model
    contamination = 0.001

    # Running IF model on normal dataset
    IF = IsolationForest(contamination=contamination, random_state=42)
    IF.fit(normal_scaled)

    # Running model on jammer dataset
    jammer['anomaly_scores'] = IF.decision_function(jammer_scaled)
    jammer['anomaly'] = IF.predict(jammer_scaled)

    # Checks if the model can accurately pick out the anomalous packets (belong to NodeID 121)
    jammer['is_anomaly'] = (jammer['NodeID'] == 121).astype(int)
    prediction = (jammer['anomaly'] == -1).astype(int)
    y_true = jammer['is_anomaly']

    # Calculates accuracy score
    acc = accuracy_score(y_true, prediction)
    return {
        "accuracy"
    }