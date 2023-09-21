app_name = 'core'

from core import views
from core.views import CommentVotingViewSet
from django.urls import path, re_path
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'comment', CommentVotingViewSet, basename="comment")

urlpatterns = [
    # See https://www.django-rest-framework.org/api-guide/viewsets/ for good documenation as_view params.

    re_path(r'^comment/(?P<pk>[0-9a-z-&]+)/$', views.CommentView.as_view(), name='comment by id'),

    re_path(
        r'^comment/(?P<pk>[0-9a-z-&]+)?user-id=(?P<user_id>[0-9a-z-&]+)/$', views.CommentView.as_view()),
    path('comments/', views.CommentsView.as_view(), name='all comments'),

    re_path(
        r'^post/(?P<parent_post_id>[0-9a-z-&]+)/comments/$', views.PostComments.as_view(), name='comments on post'),

    re_path(
        r'^post/(?P<parent_post_id>[0-9a-z-&]+)/comments/(?P<ordering>[a-zA-Z\s]*)/$', views.PostComments.as_view(), name='comments on post by order'),

    path('comment-votes/', views.CommentVotesView.as_view()),
] + router.urls
