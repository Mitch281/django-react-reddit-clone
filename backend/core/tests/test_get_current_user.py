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

    def login(self):
        url = reverse('core:token_obtain_pair')
        body = {
            'username': 'test',
            'password': 'test'
        }
        response = self.client.post(url, body, format='json')
        access_token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

    def test_get_current_user_unauthenticated(self):
        url = reverse('core:current_user')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        data = response.data
        self.assertEqual(data['detail'], 'Authentication credentials were not provided.')

    def test_get_current_user(self):
        self.login()
        url = reverse('core:current_user')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data = response.data
        self.assertEqual(data['username'], 'test')
        self.assertEqual(data['id'], USER_ID_OF_TEST_USER)