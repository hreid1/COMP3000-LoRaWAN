import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

# Input file = jammer.csv

# Set of models the user chooses from 
    # 1: Isolation Forest
    # 2: Local Outlier Forest
    # 3: Autoencoders

def preprocessing(file):
    data = pd.read_csv(file)
    df = pd.DataFrame(data)
    column_names = []

    for i in df.columns:
        column_names.append(i)

    # Dropping missing values
    normal = df.dropna()
    scaler = StandardScaler()
    normalScaled = scaler.fit_transform(normal[column_names])

    return normalScaled 

def runModel(file, option):
    data = preprocessing(file)

    if option == "1":
        print("Isolation Forest")
    if option == "2":
        print("Local Outlier Factor")
    if option == "3":
        print("Autoencoder")

def isolationForest(file):
    contamination = 0.001
    random_state = 42
    IF = IsolationForest(contamination=contamination, random_state=random_state)
    IF.fit(file)

    return 0

file = "./datasets/jammer.csv"

print("What model would you like to choose?")
model = input()

runModel(file, model)