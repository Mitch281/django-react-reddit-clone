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


class PostsView(APIView):
    """
    List and create posts.
    """

    def get_permissions(self):
        set_permission_classes(self)
        return super().get_permissions()

    def get(self, request, ordering=""):
        limit = request.GET.get("limit", "")
        page_number = request.GET.get("page-number", "")
        posts = services.PostService.get_posts(
            Post, ordering, limit, page_number)

        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostsByCategoryView(APIView):
    """
    List posts under certain categories.
    """

    def get_permissions(self):
        set_permission_classes(self)
        return super().get_permissions()

    def get(self, request, pk, ordering=""):
        limit = request.GET.get("limit", "")
        page_number = request.GET.get("page-number", "")
        posts = services.PostService.get_posts_by_category(
            Post, ordering, limit, page_number, category_id=pk)

        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)


class PostView(APIView):
    """
    Look at a certain post based on primary key sent from client.
    """

    serializer_class = PostSerializer

    def get_permissions(self):
        set_permission_classes(self)
        return super().get_permissions()

    def get(self, request, pk):
        post = Post.objects.annotate(num_comments=Count("comment")).get(id=pk)
        serializer = PostSerializer(post)
        return Response(serializer.data)

    # Note that user_id is a string while creator_of_post_id is an int!
    def delete(self, request, pk):
        post = Post.objects.get(id=pk)
        creator_of_post_id = str(post.user.id)
        user_id = request.GET.get("user-id", "")

        if creator_of_post_id == user_id:
            post.delete()

            # Return the id of the post that was just deleted.
            data = {"id": pk}

            return Response(data=data, status=status.HTTP_200_OK)
        return Response(data=None, status=status.HTTP_401_UNAUTHORIZED)

    def patch(self, request, pk):
        user_id = request.GET.get("user-id", "")
        return self.edit_content_patch(request, pk, user_id)

    def edit_content_patch(self, request, pk, user_id):
        post = Post.objects.get(id=pk)
        creator_of_post_id = str(post.user.id)
        serializer = PostSerializer(post, data=request.data, partial=True)

        if serializer.is_valid():
            if creator_of_post_id == user_id:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)
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



class PostVotesView(APIView):
    """
    List all users and their votes. This is needed to keep track of users' upvotes and downvotes. Needs to be updated
    whenever a post is upvoted or downvoted.
    """

    def get(self, request):
        user_id = request.GET.get("user", "")
        if user_id:
            votes = PostVotes.objects.filter(user=user_id)
        else:
            votes = PostVotes.objects.all()
        serializer = PostVotesSerializer(votes, many=True)
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



class PostVotingViewSet(viewsets.ViewSet):
    """
    Viewset to handle voting on posts.
    """

    # request:
    # {
    #     post_data: {
    #         num_upvotes: int
    #         num_downvotes: int
    #     }
    #     user_data: {
    #         upvote: bool
    #         downvote: bool
    #     }
    # }
    # Note, url here would be /post/{pk}/vote/vote-id={vote_id}
    @action(detail=True, methods=["put"], url_path=r'vote/vote-id=(?P<vote_id>[0-9a-z-&]*)', permission_classes=[permissions.IsAuthenticated])
    def vote(self, request, pk, vote_id):
        post_serializer = self.get_post_serializer(request, pk)
        post_vote_serializer = self.get_post_votes_serializer(request, vote_id)

        try:
            with transaction.atomic():
                if post_serializer.is_valid() and post_vote_serializer.is_valid():
                    post_serializer.save()
                    post_vote_serializer.save()
                    serializer_data = {
                        "post_data": post_serializer.data, "post_vote_data": post_vote_serializer.data}
                    return Response(serializer_data, status=status.HTTP_202_ACCEPTED)
                else:
                    serializer_errors = {
                        "post_error": post_serializer.errors, "post_vote_error": post_vote_serializer.errors}
                    return Response(serializer_errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            serializer_errors = {"post_error": post_serializer.errors,
                                 "post_vote_error": post_vote_serializer.errors}
            return Response(serializer_errors, status=status.HTTP_400_BAD_REQUEST)

    def get_post_serializer(self, request, pk):
        post = Post.objects.get(id=pk)
        post_data = request.data["post_data"]
        return serializers.PostSerializer(post, data=post_data, partial=True)

    def get_post_votes_serializer(self, request, vote_id):
        if (vote_id):
            post_vote = PostVotes.objects.get(id=vote_id)
            return serializers.PostVotesSerializer(post_vote, data=request.data["user_data"], partial=True)
        return serializers.PostVotesSerializer(data=request.data["user_data"])


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
