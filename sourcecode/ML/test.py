import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import LabelEncoder

# Input file = jammer.csv

# Set of models the user chooses from 
    # 1: Isolation Forest
    # 2: Local Outlier Forest
    # 3: Autoencoders

def preprocessing(file):
    data = pd.read_csv(file)
    df = pd.DataFrame(data)

    # Dropping missing values + duplicates
    df2 = df.dropna()
    df3 = df2.drop_duplicates()

    # Converting 'Time' to datetimeformat
    if 'Time' in df3.columns:
        df3['Time'] = pd.to_datetime(df3['Time'])
        df3['hour'] = df3['Time'].dt.hour
        df3['day_of_week'] = df3['Time'].dt.dayofweek

    # Label encoding MAC addresses
    if 'MAC' in df3.columns:
        le_mac = LabelEncoder()
        df3['MAC_encoded'] = le_mac.fit_transform(df3['MAC'])
    
    # Drop unwanted columns 
    df4 = df3.copy()
    for col in ('Time', 'MAC', 'payload'):
        if col in df4.columns:
            df4 = df4.drop(col, axis=1)
    
    # Scale the data
    scaler = StandardScaler()
    df_scaled = pd.DataFrame(scaler.fit_transform(df4), columns=df4.columns)

    column_names = []
    for i in df4.columns:
        column_names.append(i)
    
    print(column_names)

    return df_scaled, column_names

def runModel(file, option):
    processed_df, anomaly_inputs = preprocessing(file)

    if option == "1":
        print("Isolation Forest")
        isolationForest(processed_df)
    if option == "2":
        print("Local Outlier Factor")
        localOutlierFactor(processed_df)
    if option == "3":
        print("Autoencoder")
        autoencoder(processed_df)

def isolationForest(file):
    n_estimators = 100
    containmination = 0.01
    sample_size = 256

    isolation_forest = IsolationForest(n_estimators=n_estimators,
                                      contamination=containmination,
                                      max_samples=sample_size,
                                      random_state=42
                                    )
    isolation_forest.fit(file)

    data = file.loc[file.index].copy()
    data['anomaly_score'] = isolation_forest.decision_function(file)
    data['anomaly'] = isolation_forest.predict(file)
    data['anomaly'].value_counts()


    return data, isolation_forest

def localOutlierFactor(file):
    contamination = 0.01
    n_neighbors = 20
    
    local_outlier_factor = LocalOutlierFactor(n_neighbors=n_neighbors, 
                                              contamination=contamination,
                                              novelty=True
                                              )
    
    local_outlier_factor.fit(file.values)

    data = file.loc[file.index].copy()
    data['anomaly_score'] = local_outlier_factor.decision_function(file.values)
    data['anomaly'] = local_outlier_factor.predict(file.values)
    data['anomaly'].value_counts()

    return data, local_outlier_factor

def autoencoder(file):
    fig, ax = plt.subplots()
    file.plot(legend=False, ax=ax)
    plt.show()

def visualiseResults(data, model):

    plt.figure(figsize=(10,5))
    normal = data[data['anomaly'] == 1]
    plt.scatter(normal.index, normal['anomaly_score'],label='Normal')

    anomalies = data[data['anomaly'] == -1]
    plt.scatter(anomalies.index, anomalies['anomaly_score'], label='Anomalies')

    plt.xlabel("Instance")
    plt.ylabel("Anomaly Score")
    plt.legend()
    plt.show()

file = "./datasets/jammer.csv"

print("What model would you like to choose?")
model = input()

runModel(file, model)