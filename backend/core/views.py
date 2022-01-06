from django.shortcuts import render
from rest_framework import viewsets
from .models import Category, Post, Comment
from .serializers import CategorySerializer, PostSerializer, CommentSerializer

# Create your views here.

class CategoryView(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()

class PostView(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    queryset = Post.objects.all()

class CommentView(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()