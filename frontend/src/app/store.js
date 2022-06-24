import { configureStore } from '@reduxjs/toolkit';

import postsReducer from "../features/posts/postsSlice";
import usersVotesOnPostsReducer from "../features/users/usersVotesOnPostsSlice";

export default configureStore({
  reducer: {
    posts: postsReducer,
    usersVotesOnPosts: usersVotesOnPostsReducer
  }
});
