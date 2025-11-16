# Plan

## Project Aims

- I aim to deliver a web-based application that analyses LoRaWAN network traffic to detect anomalies using machine learning models

### Product Backlog

- As a user, 

### Functional/Non-functional requirements

- Functional
  - The application must feature a machine learning model which can accurately diagnose anomalous packets 
  - The application must be able to receive and process network traffic data
  - The application must notify the user if any anomalous packets are found
  - 
- Non-functional
  - The application should be secure at all points (e.g. at rest, during transit, in-use)
  - The peformance of the application should be top tier (e.g. doesn't take less than 5s to load a webpage)
  - The application can adapt and change to a wide range of use cases
  - The application is able to be ran on mobile 

### Rationale of the project

- Reasons for doing the project
  - (THE PROBLEM) something about LoRaWAN
- Why my project is better than alternatives 
  - Current solutions to this problem
- Reasons for picking languages and frameworks used (e.g. React, Django)
- Reasons for picking ML model (e.g. Why I picked isolation forest)
  - Mention F1, recall, precision scores, V-Measure, VI-Measure

## Languages/Frameworks 

### Front-end
- React/JavaScript -> Vite for installation
  - Dashboard and UI components
  - Chart.js
  - Need to use `react-router` for multi page applications

### Back-end
- Django
  - SQLite3 as DB -> Django default
  - 

### Machine learning
- Python
  - `pandas` + `numpy` for manipulating dataset
  - `scikit-learn` for machine learning model implementation
  - Might need to add a `requirements.txt` for python virtual environments
- Examples of ML models
  - LSTM
  - Isolation forest


### Deployment
- Docker/Kubernetes 

### Project Structure

#### React

```
src
|
+-- app               # application layer containing:
|   |                 # this folder might differ based on the meta framework used
|   +-- routes        # application routes / can also be pages
|   +-- app.tsx       # main application component
|   +-- provider.tsx  # application provider that wraps the entire application with different global providers - this might also differ based on meta framework used
|   +-- router.tsx    # application router configuration
+-- assets            # assets folder can contain all the static files such as images, fonts, etc.
|
+-- components        # shared components used across the entire application
|
+-- config            # global configurations, exported env variables etc.
|
+-- features          # feature based modules
|
+-- hooks             # shared hooks used across the entire application
|
+-- lib               # reusable libraries preconfigured for the application
|
+-- stores            # global state stores
|
+-- testing           # test utilities and mocks
|
+-- types             # shared types used across the application
|
+-- utils             # shared utility functions
```

## Design

![application prototype](./images/UI-design/application-prot.png)
![mobile prototype](./images/UI-design/mobile-prot.png)

## Dataset

- Is the file format just going to be csv or can it be from .pcap files as well

- Sample Datasets
  - https://www.kaggle.com/datasets/garystafford/environmental-sensor-data-132kc

## Papers/Reports

- https://ieeexplore.ieee.org/abstract/document/10649553
  - LoRaWAN IoT device usage for monitoring and control solutions in smart farming through anomaly detection
  - Used Isolation Forest for anomaly detection
  - Linear regression + Random forest for to predict future trends in environmental data
    - Peformance of Isolation Forest
      - 

- https://link.springer.com/article/10.1007/s10499-025-02104-7
  - Smart sensing and anomaly detection for microalgae culture based on LoRaWAN sensors and LSTM autoencoder
    - Performance of LSTM encoder
      - `1.000` precision
      - `0.944` recall
      - `0.971` F1-score
      - `1.000` AUC-ROC





