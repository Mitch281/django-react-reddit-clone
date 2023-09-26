import uuid

from core.models import User
from django.contrib.auth.hashers import make_password
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from seeding.seed_database import seed_database


class TestCategories(APITestCase):
    def setUp(self):
        seed_database(num_users=10, num_categories=10, num_posts=10, num_comments=10)
        test_user = User(username='test')
        # Since we are not overriding our user model and extending the AbstractUser class, we use this instead of user.set_password('test')
        test_user.password = make_password('test')
        test_user.save()

    def login(self):
        url = reverse('authentication:token_obtain_pair')
        body = {
            'username': 'test',
            'password': 'test'
        }
        response = self.client.post(url, body, format='json')
        access_token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

    def test_get_categories(self):
        url = reverse('posts:all categories')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        first_category = response.data[1]
        self.assertEqual('id' in first_category, True)
        self.assertEqual('name' in first_category, True)

    def test_create_category(self):
        self.login()
        url = reverse('posts:all categories')
        body = {
            'id': uuid.uuid4(),
            'name': 'new category'
        }
        response = self.client.post(url, body, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        data = response.data
        self.assertEqual('id' in data, True)
        self.assertEqual('name' in data, True)

    def test_create_category_unauthenticated(self):
        url = reverse('posts:all categories')
        body = {
            'id': uuid.uuid4(),
            'name': 'new category'
        }
        response = self.client.post(url, body, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        data = response.data
        self.assertEqual(data['detail'], 'Authentication credentials were not provided.')
