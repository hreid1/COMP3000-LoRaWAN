from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
import json

# JWT tests which include
    # Obtaining, verifying and refreshing tokens with/without valid credential
    # Creating resouces with/without valid credentials
    # Testing whether all tokens created are individual
    # Testing whether a user can use their token to access other peoples data

class JWTAuthenticationTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='password')

    def test_obtain_token(self):
        response = self.client.post('/api/token/', {
            'username': 'testuser',
            'password': 'password'
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_obtain_token_without_credentials(self):
        response = self.client.post('/api/token/', {
            'username': 'testuser',
            'password': 'wrongpassword'
        })

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_endpoint_with_token(self):
        token = self.client.post('/api/token/', {
            'username': 'testuser',
            'password': 'password'
        })

        accessToken = token.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {accessToken}')
        response = self.client.get('/api/lorawan/users/me/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')

    def test_refreh_token(self):
        token = self.client.post('/api/token/', {
            'username': 'testuser',
            'password': 'password'
        })

        refreshToken = token.data['refresh']
        refresh = self.client.post('/api/token/refresh/', {
            'refresh': refreshToken
        })

        self.assertEqual(refresh.status_code, status.HTTP_200_OK)
        self.assertIn('access', refresh.data)

        newToken = refresh.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {newToken}')
        response = self.client.get('/api/lorawan/users/me/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_refresh_invalid_token(self):
        response = self.client.post('/api/token/refresh/', {
            'refresh': 'invalid'
        })

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_verify_token(self):
        token = self.client.post('/api/token/', {
            'username': 'testuser',
            'password': 'password'
        })

        access = token.data['access']
        verify = self.client.post('/api/token/verify/', {
            'token': access
        })

        self.assertEqual(verify.status_code, status.HTTP_200_OK)

    def test_verify_invalid_token(self):
        token = self.client.post('/api/token/verify/', {
            'token': 'invalid'
        })
        self.assertEqual(token.status_code, status.HTTP_401_UNAUTHORIZED)

class JWTPermissionsTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user1 = User.objects.create_user(
            username='user1',
            password='pass1'
        )
        self.user2 = User.objects.create_user(
            username='user2',
            password='pass2'
        )

    def get_token(self, username, password):
        response = self.client.post('/api/token/', {
            'username': username,
            'password': password
        })

        return response.data['access']
    
    def test_user_sees_their_own_data(self):
        token = self.get_token('user1', 'pass1')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get('/api/lorawan/users/me/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'user1')
    
    def test_different_tokens_generated(self):
        token1 = self.get_token('user1', 'pass1')
        token2 = self.get_token('user2', 'pass2')

        self.assertNotEqual(token1, token2)

class JWTCreatingResources(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='password'
        )

        token = self.client.post('/api/token/', {
            'username': 'testuser',
            'password': 'password'
        })
        self.access = token.data['access']

    def test_create_node_with_authentication(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access}')
        response = self.client.post('/api/lorawan/nodes/', {
            'node_id': 1,
            'is_active': True
        })

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['owner'], self.user.id)

    def test_create_node_without_authentication(self):
        response = self.client.post('/api/lorawan/nodes/', {
            'node_id': 1,
            'is_active': True
        })

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)