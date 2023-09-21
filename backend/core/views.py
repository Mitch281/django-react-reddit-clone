from core import serializers, services
from django.db import transaction
from django.db.models import Count
from django.db.models.functions import Lower
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, Comment, CommentVotes, Post, PostVotes
from .serializers import (CategorySerializer, CommentSerializer,
                          CommentVotesSerializer, PostSerializer,
                          PostVotesSerializer)


def set_permission_classes(obj):
    if obj.request.method in ["POST", "DELETE"]:
        obj.permission_classes = [permissions.IsAuthenticated]
    elif obj.request.method in ["GET"]:
        obj.permission_classes = [permissions.AllowAny]


class CategoryView(APIView):
    """
    List and create categories.
    """

    def get_permissions(self):
        set_permission_classes(self)
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


class CommentView(APIView):
    """
    Look at a certain comment based on its primary key.
    """

    def get_permissions(self):
        set_permission_classes(self)
        return super().get_permissions()

    def get(self, request, pk):
        comment = Comment.objects.get(id=pk)
        serializer = serializers.CommentSerializer(comment)
        return Response(serializer.data)

    def patch(self, request, pk):
        user_id = request.GET.get("user-id", "")
        return self.edit_content_patch(request, pk, user_id)

    def edit_content_patch(self, request, pk, user_id):
        comment = Comment.objects.get(id=pk)
        creator_of_comment_id = str(comment.user.id)
        serializer = CommentSerializer(
            comment, data=request.data, partial=True)

        if (comment.deleted):
            return Response(data=None, status=status.HTTP_410_GONE)

        if serializer.is_valid():
            if creator_of_comment_id == user_id:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentsView(APIView):
    """
    List and create comments (across all posts).
    """

    def get_permissions(self):
        set_permission_classes(self)
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
        comments_on_specific_post = services.CommentsOnSpecificPostService.get_comments(
            Comment, parent_post_id, ordering)

        serializer = CommentSerializer(comments_on_specific_post, many=True)
        return Response(serializer.data)



class CommentVotesView(APIView):
    """
    List all users and their votes on comments. This is needed to keep track of users' upvotes and downvotes on comments.
    Needs to be updated whenever a comment is upvoted or downvoted.
    """

    def get_permissions(self):
        set_permission_classes(self)
        return super().get_permissions()

    def get(self, request, format=None):
        user_id = request.GET.get("user", "")
        if (user_id):
            votes = CommentVotes.objects.filter(user=user_id)
        else:
            votes = CommentVotes.objects.all()
        serializer = CommentVotesSerializer(votes, many=True)
        return Response(serializer.data)


class CommentVotingViewSet(viewsets.ViewSet):
    """
    Viewset to handle voting on comments.
    """

    @action(detail=True, methods=["put"], url_path=r'vote/vote-id=(?P<vote_id>[0-9a-z-&]*)', permission_classes=[permissions.IsAuthenticated])
    def vote(self, request, pk, vote_id):
        comment_serializer = self.get_comment_serializer(request, pk)
        comment_vote_serializer = self.get_comment_votes_serializer(
            request, vote_id)

        try:
            with transaction.atomic():
                if comment_serializer.is_valid() and comment_vote_serializer.is_valid():
                    comment_serializer.save()
                    comment_vote_serializer.save()
                    serializer_data = {"comment_data": comment_serializer.data,
                                       "comment_vote_data": comment_vote_serializer.data}
                    return Response(serializer_data, status=status.HTTP_202_ACCEPTED)
                else:
                    serializer_errors = {"comment_error": comment_serializer.errors,
                                         "comment_vote_error": comment_vote_serializer.errors}
                    return Response(serializer_errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            serializer_errors = {"comment_error": comment_serializer.errors,
                                 "comment_vote_error": comment_vote_serializer.errors}
            return Response(serializer_errors, status=status.HTTP_400_BAD_REQUEST)

    def get_comment_serializer(self, request, pk):
        comment = Comment.objects.get(id=pk)
        comment_data = request.data["comment_data"]
        return serializers.CommentSerializer(comment, data=comment_data, partial=True)

    def get_comment_votes_serializer(self, request, vote_id):
        if (vote_id):
            comment_vote = CommentVotes.objects.get(id=vote_id)
            return serializers.CommentVotesSerializer(comment_vote, data=request.data["user_data"], partial=True)
        return serializers.CommentVotesSerializer(data=request.data["user_data"])
