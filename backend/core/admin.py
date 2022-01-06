from django.contrib import admin
from .models import Post

# Register your models here.

class PostAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Post._meta.get_fields()]

admin.site.register(Post, PostAdmin)