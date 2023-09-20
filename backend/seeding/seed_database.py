import random
from typing import List

from core.models import Comment, Post, User
from django.contrib.auth.hashers import make_password
from seeding.factories import (CategoryFactory, CommentFactory,
                               CommentVotesFactory, PostFactory,
                               PostVotesFactory, UserFactory)


def seed_database(num_users: int, num_categories: int, num_posts: int, num_comments: int) -> None:

    # Every user votes on one post and one comment.
    num_post_votes = num_users * num_posts
    num_comment_votes = num_users * num_comments

    users: List[User] = []
    for _ in range(num_users):
        user = UserFactory()
        password = make_password('test')
        user.set_password(password)
        user.save()
        users.append(user)

    for _ in range(num_categories):
        CategoryFactory()

    posts: List[Post] = []
    for _ in range(num_posts):
        post = PostFactory()
        posts.append(post)

    comments: List[Comment] = []
    for _ in range(num_comments):
        comment = CommentFactory(parent_comment=None)
        comments.append(comment)

    user_index = 0
    post_index = 0
    for i in range(num_post_votes):
        if i == (user_index + 1) * num_posts:
            # Once the user votes on all posts, we move on to the next user and go back to the first post. Likewise for 
            # comments below.
            user_index += 1
            post_index = 0
        upvote = random.choice([True, False])
        downvote = not upvote
        post: Post = posts[post_index]
        user: User = users[user_index]
        PostVotesFactory(user=user, post=post, upvote=upvote, downvote=downvote)

        post_index += 1

    user_index = 0
    comment_index = 0
    for i in range(num_comment_votes):
        if i == (user_index + 1) * num_comments:
            user_index += 1
            comment_index = 0

        upvote = random.choice([True, False])
        downvote = not upvote
        comment: Comment = comments[comment_index]
        user: User = users[user_index]
        CommentVotesFactory(user=user, comment=comment, upvote=upvote, downvote=downvote)

        comment_index += 1