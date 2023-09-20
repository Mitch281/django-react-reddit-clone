from django.contrib.auth.models import User
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (MyTokenObtainPairSerializer, UserSerializer,
                          UserSerializerWithToken)

# Create your views here.

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
    Create a new user, and view list of all existing users.
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
        error_list = [serializer.errors[error][0]
                      for error in serializer.errors]
        return Response(error_list, status=status.HTTP_400_BAD_REQUEST)
    
    
class MyTokenObtainPairView(TokenObtainPairView):
    """
    Obtain access and refresh tokens on user login. Also returns the user id.
    """
    serializer_class = MyTokenObtainPairSerializer