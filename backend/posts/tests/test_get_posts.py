import uuid
from datetime import datetime
from typing import List

from core.models import Category, Post, User
from django.contrib.auth.hashers import make_password
from django.urls import reverse
from posts.types import PostOrderingOptions, PostType
from rest_framework import status
from rest_framework.test import APITestCase
from seeding.seed_database import seed_database


class TestGetPosts(APITestCase):
    def setUp(self):
        seed_database(num_users=10, num_categories=10, num_posts=10, num_comments=10)

    def is_ordering_new_to_old(self, posts: List[PostType]):
        for i in range(len(posts) - 1):
            current_post_datetimestring: str = posts[i]['date_created']
            next_post_datetimestring: str = posts[i + 1]['date_created']

            current_post_datetime: datetime = datetime.fromisoformat(current_post_datetimestring)
            next_post_datetime: datetime = datetime.fromisoformat(next_post_datetimestring)

            if current_post_datetime < next_post_datetime:
                return False

        return True
    
    def is_ordering_old_to_new(self, posts: List[PostType]):
        for i in range(len(posts) - 1):
            current_post_datetimestring: str = posts[i]['date_created']
            next_post_datetimestring: str = posts[i + 1]['date_created']

            current_post_datetime: datetime = datetime.fromisoformat(current_post_datetimestring)
            next_post_datetime: datetime = datetime.fromisoformat(next_post_datetimestring)

            if current_post_datetime > next_post_datetime:
                return False

        return True
    
    def is_ordering_top_to_bottom(self, posts: List[PostType]):
        for i in range(len(posts) - 1):
            current_post, next_post = posts[i], posts[i + 1]
            current_post_score = current_post['num_upvotes'] - current_post['num_downvotes']
            next_post_score = next_post['num_upvotes'] - next_post['num_downvotes']

            if current_post_score < next_post_score:
                return False
            
        return True
    
    def is_ordering_bottom_to_top(self, posts: List[PostType]):
        for i in range(len(posts) - 1):
            current_post, next_post = posts[i], posts[i + 1]
            current_post_score = current_post['num_upvotes'] - current_post['num_downvotes']
            next_post_score = next_post['num_upvotes'] - next_post['num_downvotes']

            if current_post_score > next_post_score:
                return False
            
        return True

    def test_get_all_posts(self):
        url = reverse('posts:all posts')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        posts = response.data

        self.assertEqual('id' in posts[0], True)
        self.assertEqual('username' in posts[0], True)
        self.assertEqual('category_name' in posts[0], True)
        self.assertEqual('num_comments' in posts[0], True)
        self.assertEqual('title' in posts[0], True)
        self.assertEqual('content' in posts[0], True)
        self.assertEqual('num_upvotes' in posts[0], True)
        self.assertEqual('num_downvotes' in posts[0], True)
        self.assertEqual('date_created' in posts[0], True)
        self.assertEqual('user' in posts[0], True)
        self.assertEqual('category' in posts[0], True)

        self.assertEqual(self.is_ordering_new_to_old(posts), True)


    def test_get_posts_by_new_to_old(self):
        url = reverse('posts:posts by order', kwargs = {
            'ordering': PostOrderingOptions.NEW.value
        })
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        posts = response.data

        self.assertEqual('id' in posts[0], True)
        self.assertEqual('username' in posts[0], True)
        self.assertEqual('category_name' in posts[0], True)
        self.assertEqual('num_comments' in posts[0], True)
        self.assertEqual('title' in posts[0], True)
        self.assertEqual('content' in posts[0], True)
        self.assertEqual('num_upvotes' in posts[0], True)
        self.assertEqual('num_downvotes' in posts[0], True)
        self.assertEqual('date_created' in posts[0], True)
        self.assertEqual('user' in posts[0], True)
        self.assertEqual('category' in posts[0], True)

        self.assertEqual(self.is_ordering_new_to_old(posts), True)

    def test_get_posts_by_old_to_new(self):
        url = reverse('posts:posts by order', kwargs = {
            'ordering': PostOrderingOptions.OLD.value
        })
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        posts = response.data

        self.assertEqual('id' in posts[0], True)
        self.assertEqual('username' in posts[0], True)
        self.assertEqual('category_name' in posts[0], True)
        self.assertEqual('num_comments' in posts[0], True)
        self.assertEqual('title' in posts[0], True)
        self.assertEqual('content' in posts[0], True)
        self.assertEqual('num_upvotes' in posts[0], True)
        self.assertEqual('num_downvotes' in posts[0], True)
        self.assertEqual('date_created' in posts[0], True)
        self.assertEqual('user' in posts[0], True)
        self.assertEqual('category' in posts[0], True)

        self.assertEqual(self.is_ordering_old_to_new(posts), True)

    def test_get_posts_by_top_to_bottom(self):
        url = reverse('posts:posts by order', kwargs = {
            'ordering': PostOrderingOptions.TOP.value
        })
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        posts = response.data

        self.assertEqual('id' in posts[0], True)
        self.assertEqual('username' in posts[0], True)
        self.assertEqual('category_name' in posts[0], True)
        self.assertEqual('num_comments' in posts[0], True)
        self.assertEqual('title' in posts[0], True)
        self.assertEqual('content' in posts[0], True)
        self.assertEqual('num_upvotes' in posts[0], True)
        self.assertEqual('num_downvotes' in posts[0], True)
        self.assertEqual('date_created' in posts[0], True)
        self.assertEqual('user' in posts[0], True)
        self.assertEqual('category' in posts[0], True)

        self.assertEqual(self.is_ordering_top_to_bottom(posts), True)

    def test_get_posts_by_bottom_to_top(self):
        url = reverse('posts:posts by order', kwargs = {
            'ordering': PostOrderingOptions.BOTTOM.value
        })
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        posts = response.data

        self.assertEqual('id' in posts[0], True)
        self.assertEqual('username' in posts[0], True)
        self.assertEqual('category_name' in posts[0], True)
        self.assertEqual('num_comments' in posts[0], True)
        self.assertEqual('title' in posts[0], True)
        self.assertEqual('content' in posts[0], True)
        self.assertEqual('num_upvotes' in posts[0], True)
        self.assertEqual('num_downvotes' in posts[0], True)
        self.assertEqual('date_created' in posts[0], True)
        self.assertEqual('user' in posts[0], True)
        self.assertEqual('category' in posts[0], True)

        self.assertEqual(self.is_ordering_bottom_to_top(posts), True)

    def test_get_posts_with_limit_and_page_number(self):
        limit = 5
        page_number = 1

        base_url = reverse(('posts:all posts'))
        url = f'{base_url}?limit={limit}&page-number={page_number}'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data
        self.assertEqual(len(data), limit)

    def test_get_posts_by_category(self):
        random_category = Category.objects.all()[0]
        num_posts_in_category = len(Post.objects.filter(category=random_category))

        url = reverse('posts:posts by category', kwargs = {
            'pk': random_category.id
        })

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        posts = response.data

        self.assertEqual(len(posts), num_posts_in_category)
        self.assertEqual(self.is_ordering_new_to_old(posts), True)

    def test_get_posts_by_category_and_new_to_old(self):
        random_category = Category.objects.all()[0]
        num_posts_in_category = len(Post.objects.filter(category=random_category))

        url = reverse('posts:posts by category and order', kwargs = {
            'pk': random_category.id,
            'ordering': PostOrderingOptions.NEW.value
        })

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        posts = response.data

        self.assertEqual(len(posts), num_posts_in_category)
        self.assertEqual(self.is_ordering_new_to_old(posts), True)

    def test_get_posts_by_category_and_old_to_new(self):
        random_category = Category.objects.all()[0]
        num_posts_in_category = len(Post.objects.filter(category=random_category))

        url = reverse('posts:posts by category and order', kwargs = {
            'pk': random_category.id,
            'ordering': PostOrderingOptions.OLD.value
        })

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        posts = response.data

        self.assertEqual(len(posts), num_posts_in_category)
        self.assertEqual(self.is_ordering_new_to_old(posts), True)

    def test_get_posts_by_category_and_top_to_bottom(self):
        random_category = Category.objects.all()[0]
        num_posts_in_category = len(Post.objects.filter(category=random_category))

        url = reverse('posts:posts by category and order', kwargs = {
            'pk': random_category.id,
            'ordering': PostOrderingOptions.TOP.value
        })

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        posts = response.data

        self.assertEqual(len(posts), num_posts_in_category)
        self.assertEqual(self.is_ordering_top_to_bottom(posts), True)

    def test_get_posts_by_category_and_bottom_to_top(self):
        random_category = Category.objects.all()[0]
        num_posts_in_category = len(Post.objects.filter(category=random_category))

        url = reverse('posts:posts by category and order', kwargs = {
            'pk': random_category.id,
            'ordering': PostOrderingOptions.BOTTOM.value
        })

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        posts = response.data

        self.assertEqual(len(posts), num_posts_in_category)
        self.assertEqual(self.is_ordering_bottom_to_top(posts), True)
