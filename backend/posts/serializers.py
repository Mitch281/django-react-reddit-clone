from core.models import Category, Post, PostVotes
from rest_framework import serializers


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


class PostVotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostVotes
        fields = ("__all__")



class NumberOfCommentsOnPostSerializer(serializers.Serializer):
    num_comments = serializers.IntegerField()