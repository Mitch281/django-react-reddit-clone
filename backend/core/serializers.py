from rest_framework import serializers
from .models import Category, Post, Comment, PostVotes, CommentVotes
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


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


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "id")


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

# Handle signup. For future reference, this was from https://stackoverflow.com/questions/52033003/return-token-after-registration-with-django-rest-framework-simplejwt


class UserSerializerWithToken(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()

    # Write only true means that we do not get the password in response.
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("token", "username", "id", "password")

    def get_token(self, user):
        tokens = RefreshToken.for_user(user)
        refresh = str(tokens)
        access = str(tokens.access_token)
        data = {
            "refresh": refresh,
            "access": access
        }
        return data

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


# For future reference, taken from https://stackoverflow.com/questions/61143726/return-username-and-id-with-django-rest-framework-simple-jwt-tokenrefresh
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    default_error_messages = {
        "no_active_account": "The username or password does not match."
    }

    def validate(self, attrs):
        data = super(MyTokenObtainPairSerializer, self).validate(attrs)

        data.update({'user_id': self.user.id})

        return data
