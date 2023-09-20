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

    def test_login(self):
        url = reverse('authentication:token_obtain_pair')
        body = {
            'username': 'test',
            'password': 'test'
        }
        response = self.client.post(url, body, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data
        self.assertEqual(data['refresh'][0: 2], 'ey')
        self.assertEqual(data['access'][0: 2], 'ey')
        self.assertEqual(data['user_id'], USER_ID_OF_TEST_USER)

    def test_username_does_not_exist(self):
        url = reverse('authentication:token_obtain_pair')
        body = {
            'username': 'does not exist',
            'password': 'test'
        }
        response = self.client.post(url, body, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        data = response.data
        self.assertEqual(data['detail'], 'The username or password does not match.')

    def test_wrong_password(self):
        url = reverse('authentication:token_obtain_pair')
        body = {
            'username': 'test',
            'password': 'wrong password'
        }
        response = self.client.post(url, body, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        data = response.data
        self.assertEqual(data['detail'], 'The username or password does not match.')