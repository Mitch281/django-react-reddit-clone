from django.urls import path, re_path
from core import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Note, we do not use as_view() when registering a viewset.

urlpatterns = [
    # See https://www.django-rest-framework.org/api-guide/viewsets/ for good documenation as_view params.
    path('categories/', views.CategoryView.as_view(), name='categories'),

    path("posts/", views.PostsView.as_view(), name="posts"),
    re_path(r'^posts/(?P<ordering>[a-zA-Z\s]*)/$', views.PostsView.as_view(), name='posts'),

    re_path(r'^posts/category=(?P<pk>[0-9a-z-&]+)/$', views.PostsByCategoryView.as_view()),
    re_path(r'^posts/category=(?P<pk>[0-9a-z-&]+)/(?P<ordering>[a-zA-Z\s]*)/$', views.PostsByCategoryView.as_view()),

    re_path(r'^comment/id=(?P<pk>[0-9a-z-&]+)/$', views.CommentView.as_view()),
    path('comments/', views.CommentsView.as_view(), name='comments'),

    re_path(r'^comments/post=(?P<parent_post_id>[0-9a-z-&]+)/$', views.PostComments.as_view()),

    re_path(r'^post/id=(?P<pk>[0-9a-z-&]+)/$', views.PostView.as_view()),
    re_path(r'^post/id=(?P<pk>[0-9a-z-&]+)/user-id=(?P<user_id>[0-9a-z-&]+)/$', views.PostView.as_view()),
    re_path(r'^post/num-comments/id=(?P<pk>[0-9a-z-&]+)/$', views.NumberOfCommentsOnPostView().as_view()),

    path('post-votes/', views.PostVotesView.as_view()),
    re_path(r'^post-vote/(?P<pk>[0-9a-z-&]+)/$', views.PostVoteView().as_view()),

    path('comment-votes/', views.CommentVotesView.as_view()),
    re_path(r'^comment-vote/(?P<pk>[0-9a-z-&]+)/$', views.CommentVoteView().as_view()),

    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('current-user/', views.current_user, name='current_user'),
    path('users/', views.UserList.as_view(), name='users')
]
