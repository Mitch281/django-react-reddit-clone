from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Category, Post, Comment, PostVotes
from .serializers import (CategorySerializer, 
PostSerializer, 
CommentSerializer, 
UserSerializer, 
UserSerializerWithToken, 
PostVotesSerializer,
MyTokenObtainPairSerializer)
from rest_framework_simplejwt.views import TokenObtainPairView

# Create your views here.

# TODO: Make sure that only the CREATORS of posts can delete them.
# TODO: Maybe create my own permission class.
# TODO: Make ordering case insensitive.
# TODO: Does returning 401 bad errors return all types of errors? e.g: 401 error.
class CategoryView(APIView):
    """
    List and create categories.
    """
    def get_permissions(self):
        """Set custom permissions for each action."""
        if self.request.method in ["POST", "DELETE"]:
            self.permission_classes = [permissions.IsAuthenticated, ]
        elif self.request.method in ["GET"]:
            self.permission_classes = [permissions.AllowAny, ]
        return super().get_permissions()

    def get(self, request, format=None):
        categories = Category.objects.order_by("name")
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PostsView(APIView):
    """
    List and create posts.
    """
    def get_permissions(self):
        """Set custom permissions for each action."""
        if self.request.method in ["POST", "DELETE"]:
            self.permission_classes = [permissions.IsAuthenticated, ]
        elif self.request.method in ["GET"]:
            self.permission_classes = [permissions.AllowAny, ]
        return super().get_permissions()

    def get(self, request, format=None):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# This view is for viewing posts under a certain category.
class PostsByCategoryView(APIView):
    """
    List posts under certain categories.
    """

    def get_permissions(self):
        """Set custom permissions for each action."""
        if self.request.method in ["POST", "DELETE"]:
            self.permission_classes = [permissions.IsAuthenticated, ]
        elif self.request.method in ["GET"]:
            self.permission_classes = [permissions.AllowAny, ]
        return super().get_permissions()

    def get(self, request, pk):
        posts = Post.objects.filter(category=pk)
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

class PostView(APIView):
    """
    Look at a certain post based on primary key sent from client.
    """

    serializer_class = PostSerializer

    def get_permissions(self):
        """Set custom permissions for each action."""
        if self.request.method in ["POST", "DELETE", "PATCH"]:
            print("made it")
            self.permission_classes = [permissions.IsAuthenticated, ]
        elif self.request.method in ["GET"]:
            self.permission_classes = [permissions.AllowAny, ]
        return super().get_permissions()

    def get(self, request, pk):
        post = Post.objects.get(id=pk)
        serializer = PostSerializer(post)
        return Response(serializer.data)

    def patch(self, request, pk):
        post = Post.objects.get(id=pk)
        serializer = PostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentView(APIView):
    """
    List and create comments (across all posts).
    """
    def get_permissions(self):
        """Set custom permissions for each action."""
        if self.request.method in ["POST", "DELETE"]:
            self.permission_classes = [permissions.IsAuthenticated, ]
        elif self.request.method in ["GET"]:
            self.permission_classes = [permissions.AllowAny, ]
        return super().get_permissions()

    def get(self, request, format=None):
        comments = Comment.objects.all()
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)

class PostComments(APIView):
    """
    All the comments on a post.
    """

    serializer_class = CommentSerializer

    def get(self, request, pk):
        comments = Comment.objects.filter(parent_post=pk)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

@api_view(["GET"])
@permission_classes((permissions.IsAuthenticated, ))
def current_user(request):
    """
    Determine current user by their token and return their data
    """

    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class UserList(APIView):
    """
    Create a new user. It's called 'UserList' because normally we'd have a get
    method here too, for retrieving a list of all User objects.
    """

    # No authentication here as this view is used to create users.
    permission_classes = [permissions.AllowAny, ]

    def get(self, request, format=None):
        users = User.objects.all()
        serializer = UserSerializerWithToken(users, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PostVotesView(APIView):
    """
    List all users and their votes. This is needed to keep track of users' upvotes and downvotes. Needs to be updated
    whenever a post is upvoted or downvoted.
    """

    def get_permissions(self):
        """Set custom permissions for each action."""
        if self.request.method in ["POST", "DELETE"]:
            self.permission_classes = [permissions.IsAuthenticated, ]
        elif self.request.method in ["GET"]:
            self.permission_classes = [permissions.AllowAny, ]
        return super().get_permissions()

    def get(self, request, format=None):
        votes = PostVotes.objects.all()
        serializer = PostVotesSerializer(votes, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = PostVotesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer