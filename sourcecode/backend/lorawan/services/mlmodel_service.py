from sklearn.ensemble import IsolationForest
from .preprocessing_service import PreprocessingService

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
    def runIsolationForest(processed_file):
        contamination = 0.01
        model = IsolationForest(contamination=contamination, random_state=42)
        model.fit(processed_file)
        return model

    def runLocalOutlierFactor(processed_file):
        return 0
    def runAutoencoder(processed_file):
        return 0
    
    def predict(model, processed_file):
        predictions = model.predict(processed_file)
        scores = model.decision_function(processed_file)
        
        return predictions, scores
    
    def run(uploaded_file):
        try:
            df = PreprocessingService.load_csv(uploaded_file)
            df = PreprocessingService.preprocess(df)

            train_df = PreprocessingService.load_training_data()
            train_scaled, test_scaled, scaler = PreprocessingService.preprocess(train_df, df)

            model = MLModelService.runIsolationForest(train_scaled)

            return {
                'status': 'success',
                'total_packets': len(df),
            }
        except Exception as e:
            return {
                'status': 'error',
                'error': str(e)
            }
    
