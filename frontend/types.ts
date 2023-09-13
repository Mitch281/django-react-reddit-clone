import { SetStateAction } from "react";

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

// Since we actually patch the comment when we delete it.
export type DeleteCommentResponse = PatchCommentResponse;

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

export type AddPostResponse = PatchPostResponse;

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

export type AddCommentResponse = AddCommentBody;

export type UserContextType = {
    loggedIn: boolean;
    logout: () => void;
    reLogin: () => Promise<void>;
    setLoggedIn: React.Dispatch<SetStateAction<boolean>>;
    setUserIdLoggedIn: React.Dispatch<SetStateAction<string>>;
    setUsernameLoggedIn: React.Dispatch<SetStateAction<string>>;
    userIdLoggedIn: number;
    userNameLoggedIn: string;
};
