import joblib
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.preprocessing import StandardScaler
import os

anomaly_inputs = [
    'SF', 'CF', 'SNR', 'RSSI', 'PktSeqNum',
    'numReceivedPerNode[nodeNumber-1]', 'PDRPerNode', 
    'numReceivedPerNodePerWindow[nodeNumber]', 'currentSeqNum',
    'lastSeqNumAtWindowStart[nodeNumber]',
    'interArrivalTime_s', 'interArrivalTimeMin',
]

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

localoutlierfactor = LocalOutlierFactor(contamination=contamination, n_neighbors=20, algorithm='auto', leaf_size=30, novelty=True)
localoutlierfactor.fit(df_scaled)
joblib.dump(localoutlierfactor, models_dir / "localoutlierfactor.pkl")

print("Models trained and saved successfully")

# Add to DB