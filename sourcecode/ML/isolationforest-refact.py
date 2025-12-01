import joblib
from pathlib import Path
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

anomaly_inputs = ['SF', 'CF', 'TX', 'BW', 'CR', 'SNR', 'RSSI', 'PktSeqNum', 'payloadSize', 'numReceivedPerNode[nodeNumber-1]', 'PDRPerNode']
model_path = Path(__file__).resolve().parent / "if_model.joblib"
data_directory = Path(__file__).resolve().parents[2] / "ML" / "datasets"

def trainIF():
    normal = pd.read_csv(data_directory / "jammer.csv").dropna()
    scaler = StandardScaler()
    X = normal[anomaly_inputs].astype(float)
    Xscaled = scaler.fit_transform(X)
    
    IF = IsolationForest(contamination=0.001, random_state=42)
    IF.fit(Xscaled)
    joblib.dump({'model': IF, 'scalar': scaler}, model_path)
    return model_path

def loadModel():
    if model_path.exists():
        return joblib.load(model_path)
    return None

def predict(df):
    svc = loadModel()
    if svc is None:
        trainIF()
        svc = loadModel()
    scaler = svc['scaler'] 
    model = svc['model']
    X = df[anomaly_inputs].astype(float)
    Xscaled = scaler.transform(X)
    df = df.copy()
    df['anomaly_score'] = model.decision_function(Xscaled)
    df['anomaly'] = (model.predict(Xscaled) == -1).astype(int)
    return df
