import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split

df = pd.read_csv("../../datasets/normal_dataset.csv")

X = df.drop(columns="Time")
y = df

X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42, test_size=0.2)

scatter = plt.scatter(X[:, 0], X[:, 1], c=y, s=20, edgecolor="k")
handles, labels = scatter.legend_elements()
plt.axis("square")
plt.legend(handles = handles, labels=["outliers", "inliers"], title="true class")
plt.show()