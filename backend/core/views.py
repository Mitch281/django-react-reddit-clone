from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Category, Post, Comment, PostVotes, CommentVotes
from .serializers import (CategorySerializer, CommentVotesSerializer, 
PostSerializer, 
CommentSerializer, 
UserSerializer, 
UserSerializerWithToken, 
PostVotesSerializer,
MyTokenObtainPairSerializer)
from core import serializers
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db.models.functions import Lower
from django.db.models import Count, F
# Create your views here.

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
        categories = Category.objects.order_by(Lower("name"))
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

    def get(self, request, ordering=""):
        # Default ordering (order by newest)
        if ordering == "" or ordering == "new":
            posts = Post.objects.annotate(num_comments=Count("comment")).all()
        elif ordering == "old":
            posts = Post.objects.annotate(num_comments=Count("comment")).all().order_by("date_created") # Note that django automatically orders the posts by oldest.
        elif ordering == "top":
            posts = Post.objects.annotate(num_comments=Count("comment")).annotate(net_number_votes=F("num_upvotes") - F("num_downvotes")).order_by("-net_number_votes")
        elif ordering == "bottom":
            posts = Post.objects.annotate(num_comments=Count("comment")).annotate(net_number_votes=F("num_upvotes")-F("num_downvotes")).order_by("net_number_votes")

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

    def get(self, request, pk, ordering=""):
         # Default ordering (order by newest)
        if ordering == "" or ordering == "new":
            posts = Post.objects.annotate(num_comments=Count("comment")).filter(category=pk)
            
        elif ordering == "old":
            posts = Post.objects.annotate(num_comments=Count("comment")).filter(category=pk).order_by("date_created")
        elif ordering == "top":
            posts = Post.objects.annotate(num_comments=Count("comment")).annotate(net_number_votes=F("num_upvotes")).filter(category=pk).order_by("-net_number_votes")
        elif ordering == "bottom":
            posts = Post.objects.annotate(num_comments=Count("comment")).annotate(net_number_votes=F("num_upvotes")).filter(category=pk).order_by("net_number_votes")

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
            self.permission_classes = [permissions.IsAuthenticated, ]
        elif self.request.method in ["GET"]:
            self.permission_classes = [permissions.AllowAny, ]
        return super().get_permissions()

    def get(self, request, pk):
        post = Post.objects.annotate(num_comments=Count("comment")).get(id=pk)
        serializer = PostSerializer(post)
        return Response(serializer.data)

    # Note that user_id is a string while creator_of_post_id is an int!
    def delete(self, request, pk, user_id):
        post = Post.objects.get(id=pk)
        creator_of_post_id = str(post.user.id)
        
        if creator_of_post_id == user_id:
            post.delete()

            # Return the id of the post that was just deleted.
            data = {"id": pk}

            return Response(data=data, status=status.HTTP_200_OK)
        return Response(data=None, status=status.HTTP_401_UNAUTHORIZED)

    def patch(self, request, pk, user_id=""):

        # We only send a user id when the user wants to edit the post.
        if (user_id):
            return self.edit_content_patch(request, pk, user_id)
            
        else:
            return self.vote_patch(request, pk, user_id)

    def vote_patch(self, request, pk, user_id):
        post = Post.objects.get(id=pk)
        serializer = PostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def edit_content_patch(self, request, pk, user_id):
        post = Post.objects.get(id=pk)
        creator_of_post_id = str(post.user.id)
        serializer = PostSerializer(post, data=request.data, partial=True)
        
        if creator_of_post_id == user_id:
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.data, status=status.HTTP_401_UNAUTHORIZED)
            

class CommentView(APIView):
    """
    Look at a certain comment based on its primary key.
    """

    def get_permissions(self):
        """Set custom permissions for each action."""
        if self.request.method in ["POST", "DELETE", "PATCH"]:
            self.permission_classes = [permissions.IsAuthenticated, ]
        elif self.request.method in ["GET"]:
            self.permission_classes = [permissions.AllowAny, ]
        return super().get_permissions()

    def get(self, request, pk):
        comment = Comment.objects.get(id=pk)
        serializer = serializers.CommentSerializer(comment)
        return Response(serializer.data)

    def patch(self, request, pk, user_id=""):

        if (user_id):
            return self.edit_content_patch(request, pk, user_id)
        else:
            return self.vote_patch(request, pk, user_id)

    def vote_patch(self, request, pk, user_id):
        comment = Comment.objects.get(id=pk)

        if (comment.deleted):
            return Response(data=None, status=status.HTTP_410_GONE)

        serializer = serializers.CommentSerializer(comment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def edit_content_patch(self, request, pk, user_id):
        comment = Comment.objects.get(id=pk)
        creator_of_comment_id = str(comment.user.id)
        serializer = CommentSerializer(comment, data=request.data, partial=True)

        if (comment.deleted):
            return Response(data=None, status=status.HTTP_410_GONE)

        # Note that this is also used to "delete" comments by simply patching comment inforamtion as well as setting 
        # the deleted property to true.
        if creator_of_comment_id == user_id:
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.data, status=status.HTTP_401_UNAUTHORIZED)

class CommentsView(APIView):
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

    def get(self, request, parent_post_id, ordering=""):
        # Default ordering (ordering by newest).
        if ordering == "" or ordering == "new":
            post_comments = Comment.objects.filter(parent_post=parent_post_id).order_by("-date_created")
        elif ordering == "old":
            post_comments = Comment.objects.filter(parent_post=parent_post_id) # Note that django automatically filters by oldest comments.
        elif ordering == "top":
            post_comments = Comment.objects.filter(parent_post=parent_post_id).extra(select={"net_number_votes": "num_upvotes - num_downvotes"}).extra(order_by=["-net_number_votes"])
        elif ordering == "bottom":
            post_comments = Comment.objects.filter(parent_post=parent_post_id).extra(select={"net_number_votes": "num_upvotes - num_downvotes"}).extra(order_by=["net_number_votes"])

        serializer = CommentSerializer(post_comments, many=True)
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

class PostVoteView(APIView):
    """
    This view is used to patch one specified post vote object.
    """
    permission_classes = [permissions.IsAuthenticated, ]
    
    def patch(self, request, pk):
        post_vote = PostVotes.objects.get(id=pk)
        serializer = PostVotesSerializer(post_vote, data=request.data, partial=True)
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

    def get(self, request):
        user_id = request.GET.get("user", "")
        if user_id:
            votes = PostVotes.objects.filter(user=user_id)
        else:
            votes = PostVotes.objects.all()
        serializer = PostVotesSerializer(votes, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = PostVotesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CommentVoteView(APIView):
    """
    This view is used to patch one specified comment vote object.
    """

    permission_classes = [permissions.IsAuthenticated, ]

    def patch(self, request, pk):
        comment_vote = CommentVotes.objects.get(id=pk)
        serializer = serializers.CommentVotesSerializer(comment_vote, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CommentVotesView(APIView):
    """
    List all users and their votes on comments. This is needed to keep track of users' upvotes and downvotes on comments.
    Needs to be updated whenever a comment is upvoted or downvoted.
    """

    def get_permissions(self):
        """Set custom permissions for each action."""
        if self.request.method in ["POST", "DELETE"]:
            self.permission_classes = [permissions.IsAuthenticated, ]
        elif self.request.method in ["GET"]:
            self.permission_classes = [permissions.AllowAny, ]
        return super().get_permissions()

    def get(self, request, format=None):
        user_id = request.GET.get("user", "")
        if (user_id):
            votes = CommentVotes.objects.filter(user=user_id)
        else:
            votes = CommentVotes.objects.all()
        serializer = CommentVotesSerializer(votes, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = serializers.CommentVotesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class NumberOfCommentsOnPostView(APIView):
    """
    Get the number of comments on a post given the post ID.
    """
    def get(self, request, pk):
        comments = Comment.objects.filter(parent_post=pk)
        num_comments = comments.count()
        data = {"num_comments": num_comments}
        serializer = serializers.NumberOfCommentsOnPostSerializer(data=data)
        serializer.is_valid(True)
        # return Response({"num_comments": num_comments})
        return Response(serializer.data)
