# Plan

## Project Aims

- I aim to deliver a web-based monitoring platform that is capable of analysing LoRaWAN network traffic to detect anomalies while machine learning models

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

### What the project will include

- Pages
  - Dashboard
    - Total devices monitored
    - Active vs in-active devices
    - Anomalies detected (e.g. this week)
    - Network traffic feed
    - Network traffic score (e.g. high score -> green -> less anomalies, regular packet intervals etc)
    - Recent alerts feed
  - Device Page
    - Device list with search/filter (name, ID, status)
    - Add/Remove devices functionality
    - Device status indicator (green = online, yellow = maintenace, red = offline)
    - RSSI visualisation
    - Packet count metrics per device
    - Individual device detail view with:
      - Historical metrics (RSSI, packet count, battery)
      - Anomaly history for that device
  - Anomaly
    - Anomaly feed/list 
    - Security severity levels (critical, high, medium, low)
    - Anomaly Type (jammer attack)
    - Filters
    - Anomaly detail view with
      - Packet details
      - Why it was flagged
      - affected device info
      - ML model confidence score
  - Logs
    - Network traffic logs
    - Packet history
    - Export functionality
    - Time range filtering
  - Maps
    - Geographic visualisation of devices
  - AI Info
    - Model information (algorithms used, accuracy metrics, training data info)
    - Model performance graphs
    - Prediction explanations 
    - Retraining history/logs
  - Profile
    - User information
  - Settings

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

- 2 Datasets
  - One with a jammer attack
    - 98573 Lines
  - One without
    - 99382 Lines

- Features
  - Channel Frequency (CF)
    - 3 Channels in the dataset
  - Spread Factor (SF)
    - 7-12
  - Transmission Power (TX)
    - (2-14) normal, 20 is jammer
  - Bandwidth (BW)
    - fixed
  - Coding Rate (CR)
    - fixed
  - Signal to noise ratio (SNR)
    - High for jammer
  - Receive signal strength indicator (RSSI)
    - Jammer has high values
  - PktSeqNum
    - sequence number starting from 0
  - payloadsize
    - Same for all packets
  - NoRecievedpacketPernode
    - The counter of the successfully received packets
  - NodePDR/window 
    - acceptable nodepdr/window is >= threshold
    - For example, threshold = 0.6
    - Jammer will make nodepdr/window lower
    - Window = hopping window of jammer
  - Inter-arrival time (IAT)
    - The time difference between the last packet that the server recieves and the current packet of the same node 
    - The jammer will make this high
  - jammed_packets are the packets with NodeID == 121

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





