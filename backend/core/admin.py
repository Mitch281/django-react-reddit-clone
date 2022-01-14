from django.contrib import admin
from .models import Category, Post, Comment

# Register your models here.
# TODO: add admin for postvotes table.

class CategoryAdmin(admin.ModelAdmin):
    list_display = ["id", "name"]

class PostAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "category", "title", "content", "num_upvotes", "num_downvotes", "date_created"]

class CommentAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "parent_post", "content", "num_upvotes", "num_downvotes", "date_created"]

admin.site.register(Category, CategoryAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Comment, CommentAdmin)
