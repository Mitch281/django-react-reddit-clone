import { SetStateAction } from "react";

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

export type FrontendModifiedComment = {
    content: string;
    date_created: string;
    deleted: boolean;
    id: string;
    is_hidden: boolean;
    nestingLevel?: number;
    num_downvotes: number;
    num_replies: number;
    num_upvotes: number;
    parent_comment: null | string;
    parent_post: string;
    user: number;
    username: string;
    replies?: FrontendModifiedComment[];
};

export type CommentChain = FrontendModifiedComment[];

export type CommentMap = Record<string, FrontendModifiedComment>;
