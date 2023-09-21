from django.db.models import Count, F


class PostService:
    @staticmethod
    def get_posts(post_model, ordering, limit, page_number):
        # Default ordering (order by newest)
        if ordering == "" or ordering == "new":
            posts = post_model.objects.annotate(num_comments=Count(
                "comment")).all().order_by("-date_created")
        elif ordering == "old":
            # Note that django automatically orders the posts by oldest.
            posts = post_model.objects.annotate(num_comments=Count(
                "comment")).all().order_by("date_created")
        elif ordering == "top":
            posts = post_model.objects.annotate(num_comments=Count("comment")).annotate(
                net_number_votes=F("num_upvotes") - F("num_downvotes")).order_by("-net_number_votes")
        elif ordering == "bottom":
            posts = post_model.objects.annotate(num_comments=Count("comment")).annotate(
                net_number_votes=F("num_upvotes")-F("num_downvotes")).order_by("net_number_votes")

        if (limit and page_number):
            limit = int(limit)
            page_number = int(page_number)
            for post in posts:
                post.page_number = page_number
            posts = posts[limit * (page_number - 1): limit * page_number]

        return posts

    @staticmethod
    def get_posts_by_category(post_model, ordering, limit, page_number, category_id):
        if ordering == "" or ordering == "new":
            posts = post_model.objects.annotate(num_comments=Count("comment")).filter(
                category=category_id).order_by("-date_created")
        elif ordering == "old":
            posts = post_model.objects.annotate(num_comments=Count("comment")).filter(
                category=category_id).order_by("date_created")
        elif ordering == "top":
            posts = post_model.objects.annotate(num_comments=Count("comment")).annotate(
                net_number_votes=F("num_upvotes")-F("num_downvotes")).filter(category=category_id).order_by("-net_number_votes")
        elif ordering == "bottom":
            posts = post_model.objects.annotate(num_comments=Count("comment")).annotate(
                net_number_votes=F("num_upvotes")-F("num_downvotes")).filter(category=category_id).order_by("net_number_votes")

        if (limit and page_number):
            limit = int(limit)
            page_number = int(page_number)
            for post in posts:
                post.page_number = page_number
            posts = posts[limit * (page_number - 1): limit * page_number]

        return posts