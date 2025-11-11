# Plan

## Contents

| Name of Page | Description |
| ----------- | ----------- |
| Header | Title |
| Paragraph | Text |

## Functional/Non-functional Requirements

### Functional

| Requirement | Description | Completed |
| :----------- | ----------- | :---------: |
| Working UI? | The UI needs to be functional | ☑️ |
| Paragraph | Text | |

### Non-Functional

| Requirement | Description | Completed |
| :----------- | ----------- | :---------: |
| Working UI? | The UI needs to be functional | ☑️ |
| Paragraph | Text | |

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

### Features

- Timestamp
  - When the request occured
- Source IP
  - IP address of the client
- Destination IP
  - IP address of the server
- Source Port/Destination Port
  - Ports used for communication
- Protocol
  - HTTP, HTTPS, TCP, UDP
- Request Method
  - GET, POST
- URL/Path
  - Requested resource
- Status Code
  - Server Response -> 200, 404
- Bytes Sent/Received
  - Size of data transfer
- User Agent
  - Browser or client info

## Machine Learning

- Good models at anomaly detection
  - Unsupervised models
    - Isolation Forest
    - One class support vector machine (SVM)

## Database

- Django as the backend and SQLite3 as the database (Django default)




