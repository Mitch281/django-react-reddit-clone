from django.contrib import admin
from .models import Category, Post, Comment

# Register your models here.

class CategoryAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Category._meta.get_fields()]

class PostAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Post._meta.get_fields()]

class CommentAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Comment._meta.get_fields()]

admin.site.register(Category, CategoryAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Comment, CommentAdmin)
