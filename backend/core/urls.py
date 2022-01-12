from django.urls import path, re_path
from core import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Note, we do not use as_view() when registering a viewset.

urlpatterns = [
    # See https://www.django-rest-framework.org/api-guide/viewsets/ for good documenation as_view params.
    path('categories/', views.CategoryView.as_view({"get": "list", "post": "create", "delete": "destroy"}), name='categories'),

    path('posts/', views.PostsView.as_view({"get": "list", "post": "create", "delete": "destroy"}), name='posts'),

    re_path(r'posts/category=(?P<pk>[0-9a-z-&]+)/$', views.PostsByCategoryView.as_view({"get": "list", "post": "create", "delete": "destroy"})),

    path('comments/', views.CommentView.as_view({"get": "list", "post": "create", "delete": "destroy"}), name='comments'),

    re_path(r'posts/id=(?P<pk>[0-9a-z-&]+)/$', views.PostView.as_view({"get": "list", "patch": "update"})),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('current-user/', views.current_user, name='current_user'),
    path('users/', views.UserList.as_view(), name='users')
]
