import { configureStore } from '@reduxjs/toolkit';

import postsReducer from "../features/posts/postsSlice";
import commentsReducer from "../features/comments/commentsSlice";
import usersVotesOnPostsReducer from "../features/users/usersVotesOnPostsSlice";
import usersVotesOnCommentsReducer from "../features/users/usersVotesOnCommentsSlice";

export default configureStore({
  reducer: {
    posts: postsReducer,
    comments: commentsReducer,
    usersVotesOnPosts: usersVotesOnPostsReducer,
    usersVotesOnComments: usersVotesOnCommentsReducer
  }
});
