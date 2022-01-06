from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Category(models.Model):
    id = models.TextField(primary_key=True)
    name = models.CharField(max_length=20)

    def _str_(self):
        return self.name

class Post(models.Model):
    id = models.TextField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    content = models.CharField(max_length=1000)
    num_upvotes = models.IntegerField()
    num_downvotes = models.IntegerField()
    date_created = models.DateTimeField(auto_now=False, auto_now_add=True)

    def _str_(self):
        return self.title

class Comment(models.Model):
    id = models.TextField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # We do nothing when parent post gets deleted because we still want to see the comment replies.
    parent_post = models.ForeignKey(Post, on_delete=models.DO_NOTHING)

    content = models.CharField(max_length=1000)
    num_upvotes = models.IntegerField()
    num_downvotes = models.IntegerField()
    date_created = models.DateTimeField(auto_now=False, auto_now_add=True)