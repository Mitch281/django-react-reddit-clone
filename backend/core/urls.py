from django.urls import path, re_path
from core import views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from core.views import PostVotingViewSet, CommentVotingViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'post', PostVotingViewSet, basename='post')
router.register(r'comment', CommentVotingViewSet, basename="comment")

urlpatterns = [
    # See https://www.django-rest-framework.org/api-guide/viewsets/ for good documenation as_view params.
    path('categories/', views.CategoryView.as_view(), name='categories'),

    path("posts/", views.PostsView.as_view(), name="posts"),
    re_path(r'^posts/(?P<ordering>[a-zA-Z\s]*)/$',
            views.PostsView.as_view(), name='posts'),
    re_path(r'^posts/(?P<ordering>[a-zA-Z\s]*)?limit=(?P<limit>[0-9]*)&page-number=(?P<page_number>[0-9]*)/$',
            views.PostsView.as_view(), name='posts'),
    re_path(
        r'^posts?limit=(?P<limit>[0-9]*)&page-number=(?P<page_number>[0-9]*)/$', views.PostsView.as_view()),

    re_path(r'^posts/category/(?P<pk>[0-9a-z-&]+)/$',
            views.PostsByCategoryView.as_view()),
    re_path(r'^posts/category/(?P<pk>[0-9a-z-&]+)/(?P<ordering>[a-zA-Z\s]*)/$',
            views.PostsByCategoryView.as_view()),

    re_path(r'^comment/(?P<pk>[0-9a-z-&]+)/$', views.CommentView.as_view()),
    re_path(
        r'^comment/(?P<pk>[0-9a-z-&]+)?user-id=(?P<user_id>[0-9a-z-&]+)/$', views.CommentView.as_view()),
    path('comments/', views.CommentsView.as_view(), name='comments'),

    re_path(
        r'^post/(?P<parent_post_id>[0-9a-z-&]+)/comments/$', views.PostComments.as_view()),
    re_path(
        r'^post/(?P<parent_post_id>[0-9a-z-&]+)/comments/(?P<ordering>[a-zA-Z\s]*)/$', views.PostComments.as_view()),

    re_path(r'^post/(?P<pk>[0-9a-z-&]+)/$', views.PostView.as_view()),
    re_path(
        r'^post/(?P<pk>[0-9a-z-&]+)?user-id=(?P<user_id>[0-9a-z-&]+)/$', views.PostView.as_view()),

    path('post-votes/', views.PostVotesView.as_view()),

    path('comment-votes/', views.CommentVotesView.as_view()),

    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('current-user/', views.current_user, name='current_user'),
    path('users/', views.UserList.as_view(), name='users')
] + router.urls
