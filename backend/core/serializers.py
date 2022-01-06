from rest_framework import serializers
from .models import Category, Post, Comment

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("__all__")

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ("__all__")

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ("__all__")