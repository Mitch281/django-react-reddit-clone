import { configureStore } from "@reduxjs/toolkit";

import categoriesReducer from "../features/categories/categoriesSlice";
import commentsReducer from "../features/comments/commentsSlice";
import postsReducer from "../features/posts/postsSlice";
import usersVotesOnCommentsReducer from "../features/users/usersVotesOnCommentsSlice";
import usersVotesOnPostsReducer from "../features/users/usersVotesOnPostsSlice";

const store = configureStore({
    reducer: {
        posts: postsReducer,
        comments: commentsReducer,
        categories: categoriesReducer,
        usersVotesOnPosts: usersVotesOnPostsReducer,
        usersVotesOnComments: usersVotesOnCommentsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
