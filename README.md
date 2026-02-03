# COMP3000-LoRaWAN
LoRaWAN network anomaly detection application using machine learning

## Running the application

- A python virtual environment is suggested using the requirements file located in `sourcecode/backend/requirements.txt`
- 

### Docker

1. type `docker compose up --build` in `sourcecode` directory using the terminal

### DjangoDB

1. In the `backend` directory of the `sourcecode` folder type `python manage.py makemigrations`
2. Followed by `python manage.py migrate`
3. Followed by `python manage.py runserver`
4. Followed by `python manage.py createsuperuser` for creating an admin user

### React application


