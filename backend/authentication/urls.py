app_name = 'authentication'

from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import MyTokenObtainPairView, UserList, current_user

router = DefaultRouter()

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('current-user/', current_user, name='current_user'),
    path('users/', UserList.as_view(), name='users')
] + router.urls