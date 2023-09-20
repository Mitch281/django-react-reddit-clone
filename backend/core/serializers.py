from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Category, Comment, CommentVotes, Post, PostVotes


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("__all__")


class PostSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField()
    category_name = serializers.ReadOnlyField()
    num_comments = serializers.ReadOnlyField()
    net_number_votes = serializers.ReadOnlyField()
    page_number = serializers.ReadOnlyField()

    class Meta:
        model = Post
        fields = ("__all__")


class CommentSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField()
    num_replies = serializers.SerializerMethodField("get_num_replies")
    is_hidden = serializers.SerializerMethodField("get_hidden")

    class Meta:
        model = Comment
        fields = ("__all__")

    def get_num_replies(self, obj):
        return obj.replies.count()

    # Note that every time we load from API, the comments will be unhidden.
    def get_hidden(self, obj):
        return False


class PostVotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostVotes
        fields = ("__all__")


class CommentVotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentVotes
        fields = ("__all__")


class NumberOfCommentsOnPostSerializer(serializers.Serializer):
    num_comments = serializers.IntegerField()