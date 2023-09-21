from django.contrib import admin
from .models import Category, Post, Comment, PostVotes, CommentVotes

# Register your models here.

class CategoryAdmin(admin.ModelAdmin):
    list_display = ["id", "name"]

class PostAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "category", "title", "content", "num_upvotes", "num_downvotes", "date_created"]

class CommentAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "parent_post", "content", "num_upvotes", "num_downvotes", "date_created", "parent_comment"]

class PostVotesAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "post", "upvote", "downvote"]

class CommentVotesAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "comment", "upvote", "downvote"]

admin.site.register(Category, CategoryAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(PostVotes, PostVotesAdmin)
admin.site.register(CommentVotes, CommentVotesAdmin)
