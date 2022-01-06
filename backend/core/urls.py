from django.urls import path, re_path
from core import views

# Note, we do not use as_view() when registering a viewset.

urlpatterns = [
    # See https://www.django-rest-framework.org/api-guide/viewsets/ for good documenation as_view params.
    path('categories/', views.CategoryView.as_view({"get": "list", "post": "create", "delete": "destroy"}), name='categories'),
    path('posts/', views.PostView.as_view({"get": "list", "post": "create", "delete": "destroy"}), name='posts'),
    path('comments/', views.CommentView.as_view({"get": "list", "post": "create", "delete": "destroy"}), name='comments')
]
