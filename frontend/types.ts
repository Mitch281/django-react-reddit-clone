export type PatchPostBody = {
    content: string;
};

export type PatchCommentBody = PatchPostBody;

export type PatchPostResponse = {
    category: string;
    category_name: string;
    content: string;
    date_created: string;
    id: string;
    num_downvotes: number;
    num_upvotes: number;
    title: string;
    user: number;
    username: string;
};

export type PatchCommentResponse = {
    content: string;
    date_created: string;
    deleted: boolean;
    id: string;
    is_hidden: boolean;
    num_downvotes: number;
    num_replies: number;
    num_upvotes: number;
    parent_comment: string;
    parent_post: string;
    user: number;
    username: string;
};

export type EditPostPayload = {
    userId: number;
    postId: string;
    newPostContent: string;
};

export type EditCommentPayload = {
    userId: number;
    commentId: string;
    newCommentContent: string;
};
