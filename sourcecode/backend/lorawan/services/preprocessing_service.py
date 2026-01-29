import pandas as pd
from sklearn.preprocessing import StandardScaler
from pathlib import Path

# Checking the input file if it matches the requirements to run an ml model
# Processing that 
class PreprocessingService:
    def load_csv(uploaded_file):
        try:
            df = pd.read_csv(uploaded_file)
            return df
        except Exception as e:
            raise ValueError(f"Failed to load CSV:")
    
    def validate(uploaded_file):
        return 0
    
    def preprocess(df, train_df):
        anomaly_inputs = [
            "SF", "CF", "TX", "BW", "CR", "SNR", "RSSI", "PktSeqNum", 
            "payloadSize", "numReceivedPerNode[nodeNumber-1]", "PDRPerNode"
        ]
        # Drop duplicates / missing rows
        # Scale data
        df = df.dropna()
        scaler = StandardScaler()
        df_scaled = scaler.fit_transform(df[anomaly_inputs])
        train_scaled = scaler.transform(train_df[anomaly_inputs])
        
        return df_scaled, train_scaled, scaler
    
    def load_training_data():
        base_dir = Path(__file__).resolve().parent.parent
        normal_path = base_dir / "datasets" / "no-jammer.csv"
        if not normal_path.exists():
            raise FileNotFoundError(f"Training data not found: ")
        return pd.read_csv(normal_path).dropna()