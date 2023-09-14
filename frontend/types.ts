import { SetStateAction } from "react";

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

export type DeletePostPayload = {
    postId: string;
    userId: number;
};

export type DeleteCommentPayload = {
    commentId: string;
    userId: number;
};

export type DeletePostResponse = {
    id: string;
};

export type DeleteCommentBody = {
    deleted: boolean;
};

// Same as PatchCommentResponse since we actually patch a comment when we delete it.
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

export type AddPostBody = {
    category: string;
    category_name: string;
    content: string;
    date_created: string;
    id: string;
    title: string;
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

export type AddCommentBody = {
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

export type Comment = {
    content: string;
    date_created: string;
    deleted: boolean;
    id: string;
    is_hidden: boolean;
    nestingLevel: number;
    num_downvotes: number;
    num_replies: number;
    num_upvotes: number;
    parent_comment: string | null;
    parent_post: string;
    user: number;
    username: string;
};

export type UserContextType = {
    loggedIn: boolean;
    logout: () => void;
    reLogin: () => Promise<void>;
    setLoggedIn: React.Dispatch<SetStateAction<boolean>>;
    setUserIdLoggedIn: React.Dispatch<SetStateAction<string>>;
    setUsernameLoggedIn: React.Dispatch<SetStateAction<string>>;
    userIdLoggedIn: string;
    usernameLoggedIn: string;
};

export type Post = {
    category: string;
    category_name: string;
    content: string;
    date_created: string;
    id: string;
    num_comments: number;
    num_downvotes: number;
    num_upvotes: number;
    page_number: number;
    title: string;
    user: number;
    username: string;
};

export type Order = "new" | "old" | "top" | "bottom";

export type FetchPostsPayload = {
    order?: Order;
    pageNumber: number;
};

export type FetchPostsByCategoryPayload = {
    order?: Order;
    pageNumber: number;
    categoryId: string;
};

// export type Comment = {
//     content: string;
//     date_created: string;
//     deleted: boolean;
//     id: string;
//     is_hidden: boolean;
//     num_downvotes: number;
//     num_replies: number;
//     num_upvotes: number;
//     parent_comment: null | string;
//     parent_post: string;
//     user: number;
//     username: string;
// };

export type FetchCommentsPayload = {
    order?: Order;
    postId: string;
};

export type UsersVoteOnPost = {
    downvote: boolean;
    id: string;
    post: string;
    upvote: boolean;
    user: number;
};

export type UsersVoteOnComment = {
    comment: string;
    downvote: boolean;
    id: string;
    upvote: boolean;
    user: number;
};

export type LoginResponse = {
    access: string;
    refresh: string;
    user_id: number;
};

type Token = {
    access: string;
    refresh: string;
};

export type SignupResponse = {
    id: number;
    token: Token;
    username: string;
};

export type Category = {
    id: string;
    name: string;
};

export type AddCategoryResponse = {
    id: string;
    name: string;
};

export type CreateCategoryPayload = {
    id: string;
    name: string;
};

export type VerifyCurrentUserResponse = {
    username: string;
    id: number;
};
