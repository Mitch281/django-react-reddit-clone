from django.shortcuts import render
from rest_framework import viewsets, permissions
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Category, Post, Comment
from .serializers import CategorySerializer, PostSerializer, CommentSerializer, UserSerializer, UserSerializerWithToken

# Create your views here.

# TODO: Maybe create my own permission class.
class CategoryView(viewsets.ModelViewSet):
    def get_permissions(self):
        # Only users can create categories.
        if self.request.method == "POST" or self.request.method == "DELETE":
            permission_classes = [permissions.IsAuthenticated(), ]
            
        else:
            permission_classes = [permissions.AllowAny(), ]

    serializer_class = CategorySerializer
    queryset = Category.objects.all()

class PostView(viewsets.ModelViewSet):
    def get_permissions(self):
        # Only users can create posts.
        if self.request.method == "POST" or self.request.method == "DELETE":
            permission_classes = [permissions.IsAuthenticated(), ]
            return permission_classes
            
        else:
            permission_classes = [permissions.AllowAny(), ]
            return permission_classes

    serializer_class = PostSerializer
    queryset = Post.objects.all()

class CommentView(viewsets.ModelViewSet):
    # Only users can comment.
    def get_permissions(self):
        # Only users can create categories.
        if self.request.method == "POST" or self.request.method == "DELETE":
            permission_classes = [permissions.IsAuthenticated(), ]
            
        else:
            permission_classes = [permissions.AllowAny(), ]
        
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

@api_view(["GET"])
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
    permission_classes = [permissions.AllowAny(), ]

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