from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
import pandas as pd
from io import BytesIO
import json
from lorawan.models import Node, Packet, MLModel, Anomaly, ModelPredictionInfo, Alert, Log

# Contains tests for the views 

class TrainModelsViewTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password')
        self.client = APIClient()

    def test_train_models_post(self):
        response = self.client.get('/api/lorawan/train-models/')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_train_model(self):
        response = self.client.post('/api/lorawan/train-models/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('success', response.data)
        self.assertIn('message', response.data)
        self.assertIn('models', response.data)
        self.assertTrue(response.data['success'])

class RunModelViewTestCase(APITestCase):
    def setUp(self):
        self.user=User.objects.create_user(username='testuser', password='password')
        self.client=APIClient()
        self.client.force_authenticate(user=self.user)

        # Need to include multiple sets of sample data to collect silhouette score
        self.sample_data = {
            'Time': ['2024-01-01 10:00:00', '2024-01-01 10:00:01', '2024-01-01 10:00:02', '2024-01-01 10:00:03', '2024-01-01 10:00:04'],
            'NodeID': [1, 1, 1, 1, 1],
            'MAC': ['AABBCC', 'AABBCC', 'AABBCC', 'AABBCC', 'AABBCC'],
            'SF': [12, 12, 12, 12, 1], 
            'CF': [868.0, 868.0, 868.0, 868.0, 800.0],  
            'TX': [14, 14, 14, 14, 14],
            'BW': [125, 125, 125, 125, 125],
            'CR': [1, 1, 1, 1, 1],
            'SNR': [5.5, 5.6, 5.4, 5.7, -50.0],  
            'RSSI': [-100, -101, -99, -100, -200],  
            'PktSeqNum': [1, 2, 3, 4, 5],
            'payload': ['test', 'test', 'test', 'test', 'test'],
            'payloadSize': [20, 20, 20, 20, 20],
            'numReceivedPerNode[nodeNumber-1]': [1, 1, 1, 1, 1],
            'PDRPerNode': [100, 100, 100, 100, 100],
            'currentSeqNum': [1, 2, 3, 4, 5],
            'numReceivedPerNodePerWindow[nodeNumber]': [1, 1, 1, 1, 1],
            'lastSeqNumAtWindowStart[nodeNumber]': [0, 0, 0, 0, 0],
            'pdrPerNodePerWindow[nodeNumber]': [100, 100, 100, 100, 100],
            'interArrivalTime_s': [60.0, 61.0, 59.5, 60.5, 500.0], 
            'interArrivalTimeMin': [1.0, 1.0, 1.0, 1.0, 1.0]
        }

        # Invalid data with missing NodeID
        self.invalid_sample_data = {
            'Time': ['2024-01-01 10:00:00', '2024-01-01 10:00:01', '2024-01-01 10:00:02'],
            'MAC': ['AABBCC', 'AABBCC', 'AABBCC'],
            'SF': [12, 12, 12],
            'CF': [868.0, 868.0, 868.0],
            'TX': [14, 14, 14],
            'BW': [125, 125, 125],
            'CR': [1, 1, 1],
            'SNR': [5.5, 5.6, 5.4],
            'RSSI': [-100, -101, -99],
            'PktSeqNum': [1, 2, 3],
            'payload': ['test', 'test', 'test'],
            'payloadSize': [20, 20, 20],
            'numReceivedPerNode[nodeNumber-1]': [1, 1, 1],
            'PDRPerNode': [100, 100, 100],
            'numReceivedPerNodePerWindow[nodeNumber]': [1, 1, 1],
            'currentSeqNum': [1, 2, 3],
            'lastSeqNumAtWindowStart[nodeNumber]': [0, 0, 0],
            'pdrPerNodePerWindow[nodeNumber]': [100, 100, 100],
            'interArrivalTime_s': [60.0, 61.0, 59.5],
            'interArrivalTimeMin': [1.0, 1.0, 1.0]
        }

    def create_csv_file(self, data=None):
        if data is None:
            data = self.sample_data

        df = pd.DataFrame(data)
        csv_file = BytesIO()
        df.to_csv(csv_file, index=False)
        csv_file.seek(0)
        csv_file.name='test.csv'

        return csv_file
    
    def create_invalid_csv_file(self, data=None):
        if data is None:
            data = self.invalid_sample_data
        
        df = pd.DataFrame(data)
        csv_file = BytesIO()
        df.to_csv(csv_file, index=False)
        csv_file.seek(0)
        csv_file.name='invalid.csv'

        return csv_file
    
    def test_runmodel_without_authentication(self):
        client = APIClient()
        csv_file = self.create_csv_file()

        response = client.post(
            '/api/lorawan/run/',
            {
                "myFile": csv_file,
                "model": "IsolationForest"
            },
            format='multipart'
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    
    def test_runmodel_with_valid_csv(self):
        csv_file = self.create_csv_file()
        response = self.client.post(
            '/api/lorawan/run/',
            {
                'myFile': csv_file,
                'model': 'IsolationForest'
            },
            format='multipart'
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('success', response.data)
        self.assertIn('performance', response.data)

    # Test model with invalid csv
    def test_runmodel_with_invalid_csv(self):
        csv_file = self.create_invalid_csv_file()
        response = self.client.post(
            '/api/lorawan/run/',
            {
                'myFile': csv_file,
                'model': 'IsolationForest'
            },
            format='multipart'
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_runmodel_with_no_file(self):
        response = self.client.post(
            '/api/lorawan/run/',
            {
                'model': 'IsolationForest',
            },
            format='multipart'
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

