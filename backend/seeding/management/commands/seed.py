

from core.models import Category, Comment, CommentVotes, Post, PostVotes, User
from django.contrib.auth.hashers import make_password
from django.core.management.base import BaseCommand
from django.db import transaction
from seeding.seed_database import seed_database


def create_super_user():
    user = User(id=1, username='admin', password=make_password('admin'))
    user.is_admin = True
    user.is_superuser = True
    user.is_staff = True
    user.is_active=True
    user.set_password('admin')
    user.save()

def delete_all_data():
    models = [User, Category, Post, Comment, PostVotes, CommentVotes]
    for model in models:
        model.objects.all().delete()
        

class Command(BaseCommand):
    help = "Generates test data for database"

    @transaction.atomic
    def handle(self, *args, **kwargs):
        self.stdout.write('Deleting old data...\n')
        delete_all_data()

        self.stdout.write('Creating super user...\n')
        create_super_user()

        self.stdout.write('Creating new data...\n')
        seed_database(num_users=5, num_posts=10, num_comments=100, num_categories=10)

        self.stdout.write('Seeding Complete!\n')
        self.stdout.write('Please login to superuser account with username of admin and password of admin.')

# import logging

# logger = logging.getLogger('factory')
# logger.addHandler(logging.StreamHandler())
# logger.setLevel(logging.DEBUG)
