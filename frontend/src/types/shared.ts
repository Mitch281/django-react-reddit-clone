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

export type AddCommentReplyBody = {
    id: string;
    username: string;
    user: number;
    parent_post: string;
    content: string;
    date_created: string;
    parent_comment: string;
    is_hidden: boolean;
    num_replies: number;
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
export type Token = {
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
export type CreateCategoryPayload = {
    id: string;
    name: string;
};
export type VerifyCurrentUserResponse = {
    username: string;
    id: number;
};

export type LoginResponse = {
    access: string;
    refresh: string;
    user_id: number;
};

export type UpvoteData = {
    num_upvotes: number;
    num_downvotes?: number;
};

export type DownvoteData = {
    num_upvotes?: number;
    num_downvotes: number;
};

export type UserPostVoteOnUpvote =
    | {
          id: any;
          upvote: boolean;
          downvote?: undefined;
          user?: undefined;
          post?: undefined;
      }
    | {
          id: any;
          upvote: boolean;
          downvote: boolean;
          user?: undefined;
          post?: undefined;
      }
    | {
          id: string;
          upvote: boolean;
          downvote: boolean;
          user: string;
          post: string;
      };

export type UserPostVoteOnDownvote =
    | {
          id: any;
          upvote: boolean;
          downvote: boolean;
          user?: undefined;
          post?: undefined;
      }
    | {
          id: any;
          downvote: boolean;
          upvote?: undefined;
          user?: undefined;
          post?: undefined;
      }
    | {
          id: string;
          upvote: boolean;
          downvote: boolean;
          user: string;
          post: string;
      };

export type PostVoteData = {
    post_data: UpvoteData | DownvoteData;
    user_data: UserPostVoteOnUpvote | UserPostVoteOnDownvote;
};

export type VoteOnPostPayload = {
    postId: string;
    data: PostVoteData;
    usersVoteOnPostId?: string;
};

export type UserCommentVoteOnUpvote =
    | {
          id: any;
          upvote: boolean;
          downvote?: undefined;
          user?: undefined;
          comment?: undefined;
      }
    | {
          id: any;
          upvote: boolean;
          downvote: boolean;
          user?: undefined;
          comment?: undefined;
      }
    | {
          id: string;
          upvote: boolean;
          downvote: boolean;
          user: string;
          comment: string;
      };

export type UserCommentVoteOnDownvote =
    | {
          id: any;
          upvote: boolean;
          downvote: boolean;
          user?: undefined;
          comment?: undefined;
      }
    | {
          id: any;
          downvote: boolean;
          upvote?: undefined;
          user?: undefined;
          comment?: undefined;
      }
    | {
          id: string;
          upvote: boolean;
          downvote: boolean;
          user: string;
          comment: string;
      };

export type CommentVoteData = {
    comment_data: UpvoteData | DownvoteData;
    user_data: UserCommentVoteOnUpvote | UserCommentVoteOnDownvote;
};

export type VoteOnCommentPayload = {
    commentId: string;
    data: CommentVoteData;
    usersVoteOnCommentId?: string;
};
