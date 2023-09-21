
class CommentsOnSpecificPostService:
    @staticmethod
    def get_comments(comment_model, parent_post_id, ordering):
        # Default ordering (ordering by newest).
        if ordering == "" or ordering == "new":
            comments_on_specific_post = comment_model.objects.filter(
                parent_post=parent_post_id).order_by("-date_created")
        elif ordering == "old":
            # Note that django automatically filters by oldest comments.
            comments_on_specific_post = comment_model.objects.filter(
                parent_post=parent_post_id)
        elif ordering == "top":
            comments_on_specific_post = comment_model.objects.filter(parent_post=parent_post_id).extra(
                select={"net_number_votes": "num_upvotes - num_downvotes"}).extra(order_by=["-net_number_votes"])
        elif ordering == "bottom":
            comments_on_specific_post = comment_model.objects.filter(parent_post=parent_post_id).extra(
                select={"net_number_votes": "num_upvotes - num_downvotes"}).extra(order_by=["net_number_votes"])

        return comments_on_specific_post
