from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

# Handle signup. For future reference, this was from https://stackoverflow.com/questions/52033003/return-token-after-registration-with-django-rest-framework-simplejwt


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "id")

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
