from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Post(models.Model):
    id = models.TextField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    content = models.CharField(max_length=1000)
    num_upvotes = models.IntegerField()
    num_downvotes = models.IntegerField()
    date_created = models.DateTimeField(auto_now=False, auto_now_add=True)
    # TODO: foreign keys.

    def _str_(self):
        return self.title