from core.models import User
from django.contrib.auth.hashers import make_password
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

USER_ID_OF_TEST_USER = 1

class TestLogin(APITestCase):
    def test_signup(self):
        url = reverse('core:users')
        body = {
            'username': 'test',
            'password': 'test'
        }
        response = self.client.post(url, body, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        data = response.data
        token = data['token']
        self.assertEqual(token['refresh'][0: 2], 'ey')
        self.assertEqual(token['access'][0: 2], 'ey')
        self.assertEqual(data['username'], 'test')
        self.assertEqual(data['id'], 1)

    def test_signup_username_already_exists(self):
        url = reverse('core:users')
        body = {
            'username': 'test',
            'password': 'test'
        }
        self.client.post(url, body, format='json')

        duplicate_response = self.client.post(url, body, format='json')

        self.assertEqual(duplicate_response.status_code, status.HTTP_400_BAD_REQUEST)
        
        data = duplicate_response.data
        self.assertEqual(data[0], 'A user with that username already exists.')


