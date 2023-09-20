from core.models import User
from django.contrib.auth.hashers import make_password
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

USER_ID_OF_TEST_USER = 1

class TestLogin(APITestCase):
    def setUp(self):
        test_user = User(id=USER_ID_OF_TEST_USER, username='test')
            # Since we are not overriding our user model and extending the AbstractUser class, we use this instead of user.set_password('test')
        test_user.password = make_password('test')
        test_user.save()

    def test_valid_refresh_token(self):
        url = reverse('authentication:token_obtain_pair')
        body = {
            'username': 'test',
            'password': 'test'
        }
        response = self.client.post(url, body, format='json')
        refresh_token = response.data['refresh']

        url = reverse('authentication:token_refresh')
        body = {
            'refresh': refresh_token
        }
        response = self.client.post(url, body, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data
        self.assertEqual(data['access'][0: 2], 'ey')

    def test_invalid_refresh_token(self):
        url = reverse('authentication:token_refresh')
        refresh_token = 'abcdefg'
        body = {
            'refresh': refresh_token
        }
        response = self.client.post(url, body, format='json')   
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        data = response.data
        self.assertEqual(data['detail'], 'Token is invalid or expired')

