import { configureStore } from '@reduxjs/toolkit';

import categoriesReducer from "../features/categories/categoriesSlice.ts";
import commentsReducer from "../features/comments/commentsSlice";
import postsReducer from "../features/posts/postsSlice";
import usersVotesOnCommentsReducer from "../features/users/usersVotesOnCommentsSlice";
import usersVotesOnPostsReducer from "../features/users/usersVotesOnPostsSlice";

export default configureStore({
  reducer: {
    posts: postsReducer,
    comments: commentsReducer,
    categories: categoriesReducer,
    usersVotesOnPosts: usersVotesOnPostsReducer,
    usersVotesOnComments: usersVotesOnCommentsReducer
  }
});
