# COMP3000-LoRaWAN

LoRaWAN network anomaly detection platform with a Django REST backend, a React dashboard, and machine learning services for analysing packet traffic and flagging suspicious activity.

## Overview

The project combines a web dashboard with a backend API so operators can monitor LoRaWAN devices, inspect packet history, review alerts and logs, and train or run anomaly-detection models.

## Features

- Login-protected dashboard for monitoring the network
- Device, packet, log, alert, and anomaly views
- AI model information and model training endpoints
- Map-based device locations and operational status
- Django REST Framework API with JWT authentication
- Machine learning service for training anomaly-detection models

## Tech Stack

- 

- Backend: Python, Django, Django REST Framework, SimpleJWT, django-filter
- Frontend: React, Vite, Material UI, Leaflet, Chart.js, Recharts
- Data and ML: SQLite, pandas, NumPy, scikit-learn, joblib, SHAP, 

## Project Structure

- `sourcecode/backend/` - Django project, API, models, and ML service code
- `sourcecode/my-app/` - React frontend
- `sourcecode/backend/lorawan/services/datasets/` - sample datasets used for model training
- `docs/` - project notes, diagrams, and report material

## Prerequisites

- Python 3.11+ recommended
- Node.js 18+ and npm
- Optional: Docker and Docker Compose

## Running Locally

### 1. Backend

```bash
cd sourcecode/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The backend uses SQLite by default and is available at `http://127.0.0.1:8000/`.

### 2. Frontend

```bash
cd sourcecode/my-app
npm install
npm run dev
```

The frontend runs at `http://127.0.0.1:5173/`.

## Docker

If you are using the Docker setup in `sourcecode/`, run:

```bash
cd sourcecode
docker compose up --build
```

## API Endpoints

- `api/lorawan/nodes`
- `api/lorawanusers`
- `api/lorawan/packets`
- `api/lorwawnlmodels`
- `api/lorawan/anomaly`
- `api/lorawan/userprofiles`
- `api/lorawan/modeltraininginfos`
- `api/lorawan/modelpredictioninfos`
- `api/lorawan/alerts`
- `api/lorawan/logs`

- `POST /lorawan/run/`
- `POST /lorawan/train-models/`

## Frontend Screens

The React app includes pages for:

- Login
- Dashboard
- Devices
- Logs
- AI information
- Anomaly monitoring
- Admin
- Profile and settings

## Notes

- JWT is used for authentication.


