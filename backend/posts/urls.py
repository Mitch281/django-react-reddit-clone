app_name = 'posts'

from django.urls import path, re_path
from posts import views
from posts.views import PostVotingViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'post', PostVotingViewSet, basename='post')

urlpatterns = [
    # See https://www.django-rest-framework.org/api-guide/viewsets/ for good documenation as_view params.
    path('categories/', views.CategoryView.as_view(), name='all categories'),

    path("posts/", views.PostsView.as_view(), name='all posts'),

    re_path(r'^posts/(?P<ordering>[a-zA-Z\s]*)/$',
            views.PostsView.as_view(), name='posts by order'),

    re_path(r'^posts/category/(?P<pk>[0-9a-z-&]+)/$',
            views.PostsByCategoryView.as_view(), name='posts by category'),

    re_path(r'^posts/category/(?P<pk>[0-9a-z-&]+)/(?P<ordering>[a-zA-Z\s]*)/$',
            views.PostsByCategoryView.as_view(), name='posts by category and order'),

    re_path(r'^post/(?P<pk>[0-9a-z-&]+)/$', views.PostView.as_view(), name='post by id'),

    path('post-votes/', views.PostVotesView.as_view()),
] + router.urls
