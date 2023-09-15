export type PatchPostBody = {
    content: string;
};
export type PatchCommentBody = {
    content: string;
};
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
    parent_comment: null | string;
    parent_post: string;
    user: number;
    username: string;
};
export type DeletePostResponse = {
    id: string;
};
export type DeleteCommentBody = {
    deleted: boolean;
}; // Same as PatchCommentResponse since we actually patch a comment when we delete it.

export type DeleteCommentResponse = {
    content: string;
    date_created: string;
    deleted: boolean;
    id: string;
    is_hidden: boolean;
    num_downvotes: number;
    num_replies: number;
    num_upvotes: number;
    parent_comment: null | string;
    parent_post: string;
    user: number;
    username: string;
};
export type AddPostResponse = {
    category: string;
    category_name: string;
    content: string;
    date_created: string;
    id: string;
    title: string;
    user: number;
    username: string;
};
export type AddCommentResponse = {
    content: string;
    date_created: string;
    is_hidden: boolean;
    id: string;
    num_downvotes: number;
    num_replies: number;
    num_upvotes: number;
    parent_comment: null | string;
    parent_post: string;
    user: number;
    username: string;
};
export type AddCategoryResponse = {
    id: string;
    name: string;
};

export type PostVoteResponse = {
    post_data: PatchPostResponse;
    post_vote_data: {
        downvote: boolean;
        id: string;
        post: string;
        upvote: boolean;
        user: number;
    };
};

export type CommentVoteResponse = {
    comment_data: PatchCommentResponse;
    comment_vote_data: {
        comment: string;
        downvote: boolean;
        id: string;
        upvote: boolean;
        user: number;
    };
};
