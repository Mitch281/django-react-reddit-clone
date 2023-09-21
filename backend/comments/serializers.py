from core.models import Comment, CommentVotes
from rest_framework import serializers


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


class CommentVotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentVotes
        fields = ("__all__")