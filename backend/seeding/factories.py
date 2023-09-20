import random

import factory
import factory.fuzzy
from core.models import *
from django.utils import timezone
from factory.django import DjangoModelFactory

SAMPLE_EXERCISES = [
    'Lat Pulldown',
    'Bench Press',
    'Leg Press',
    'Squat',
    'Deadlift',
    'Barbell Overhead Press',
    'Bicep Curls',
    'Tricep Pushdowns'
]

SAMPLE_WORKOUT_TITLES = [
    'Chest',
    'Full Body',
    'Back',
    'Arms',
    'Shoulders'
]


class UserFactory(DjangoModelFactory):
    class Meta:
        model = User

    # To satisfy unique constraint
    username = factory.Sequence(lambda n: f'username {n}')

class CategoryFactory(DjangoModelFactory):
    class Meta:
        model = Category

    id = factory.Faker('uuid4')

    # To satisfy unique constraint
    name = factory.Sequence(lambda n: f'category {n}')

class PostFactory(DjangoModelFactory):
    class Meta:
        model = Post

    id = factory.Faker('uuid4')
    user = factory.SubFactory(UserFactory)
    category = factory.SubFactory(CategoryFactory)
    title = factory.Faker('name')
    content = factory.Faker('paragraph')
    num_upvotes = factory.fuzzy.FuzzyInteger(0, 100)
    num_downvotes = factory.fuzzy.FuzzyInteger(0, 100)
    date_created = factory.Faker('date_time', tzinfo=timezone.get_current_timezone())

class CommentFactory(DjangoModelFactory):
    class Meta:
        model = Comment

    id = factory.Faker('uuid4')
    user = factory.SubFactory(UserFactory)
    parent_post = factory.SubFactory(PostFactory)
    content = factory.Faker('paragraph')
    num_upvotes = factory.fuzzy.FuzzyInteger(0, 100)
    num_downvotes = factory.fuzzy.FuzzyInteger(0, 100)
    date_created = factory.Faker('date_time', tzinfo=timezone.get_current_timezone())
    parent_comment = factory.SubFactory('seeding.factories.CommentFactory')

class PostVotesFactory(DjangoModelFactory):
    class Meta:
        model = PostVotes

    # Parameters
    user = None
    post = None
    upvote = None
    downvote = None

    id = factory.Faker('uuid4')

class CommentVotesFactory(DjangoModelFactory):
    class Meta:
        model = CommentVotes

    # Parameters
    user = None
    comment = None
    upvote = None
    downvote = None

    id = factory.Faker('uuid4')
    
