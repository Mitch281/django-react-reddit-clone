import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
    createSelector,
} from "@reduxjs/toolkit";
import { handleFetchError } from "../../utils/auth";
import { authorisedFetchWrapper } from "../../utils/authorised-fetch-wrapper";
import { constants } from "../../utils/constants";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const postsAdapter = createEntityAdapter();

const initialState = postsAdapter.getInitialState({
    status: "idle",
    error: null,
    hasMorePosts: true,
    pageNumber: 1,
});

export const fetchPosts = createAsyncThunk(
    "posts/fetchPosts",
    async (fetchInformation) => {
        const { order, pageNumber } = fetchInformation;
        console.log(order);
        let url;
        if (order) {
            url = `${API_ENDPOINT}/posts/${order}?limit=${constants.POSTS_PER_PAGE}&page-number=${pageNumber}`;
        } else {
            url = `${API_ENDPOINT}/posts?limit=${constants.POSTS_PER_PAGE}&page-number=${pageNumber}`;
        }
        const response = await fetch(url);
        const json = await response.json();
        return json;
    }
);

export const fetchPostsByCategory = createAsyncThunk(
    "posts/fetchPostsByCategory",
    async (fetchInformation) => {
        const { order, categoryId } = fetchInformation;
        let url;
        if (order) {
            url = `${API_ENDPOINT}/posts/category/${categoryId}/${order}/`;
        } else {
            url = `${API_ENDPOINT}/posts/category/${categoryId}/`;
        }
        const response = await fetch(url);
        const json = await response.json();
        return json;
    }
);

export const fetchSinglePost = createAsyncThunk(
    "posts/fetchSinglePost",
    async (postId) => {
        const response = await fetch(`${API_ENDPOINT}/post/${postId}/`);
        const json = await response.json();
        return json;
    }
);

export const voteOnPost = createAsyncThunk(
    "posts/voteOnPost",
    async (voteData) => {
        const { postId, usersVoteOnPostId, data } = voteData;
        let url;
        if (usersVoteOnPostId) {
            url = `${API_ENDPOINT}/post/${postId}/vote/vote-id=${usersVoteOnPostId}/`;
        } else {
            // User has not voted on post yet.
            url = `${API_ENDPOINT}/post/${postId}/vote/vote-id=/`;
        }
        try {
            const response = await authorisedFetchWrapper.put(url, data);
            const json = await response.json();
            return json;
        } catch (error) {
            handleFetchError(
                error,
                "Could not vote on post! Please try again later."
            );
        }
    }
);

export const addNewPost = createAsyncThunk(
    "posts/addNewPost",
    async (newPost) => {
        const url = `${API_ENDPOINT}/posts/`;
        try {
            const response = await authorisedFetchWrapper.post(url, newPost);
            const json = await response.json();
            return json;
        } catch (error) {
            handleFetchError(
                error,
                "Could not add new post! Please try again later."
            );
        }
    }
);

export const editPost = createAsyncThunk(
    "posts/editPost",
    async (editPostInformation) => {
        const { postId, userId, newPostContent } = editPostInformation;
        const patchData = { content: newPostContent };
        const url = `${API_ENDPOINT}/post/${postId}/?user-id=${userId}`;
        try {
            const response = await authorisedFetchWrapper.patch(url, patchData);
            const json = await response.json();
            return json;
        } catch (error) {
            handleFetchError(
                error,
                "Could not edit post! Please try again later."
            );
        }
    }
);

export const deletePost = createAsyncThunk(
    "posts/deletePost",
    async (deleteInformation) => {
        const { postId, userId } = deleteInformation;
        const url = `${API_ENDPOINT}/post/${postId}/?user-id=${userId}`;
        try {
            const response = await authorisedFetchWrapper.delete(url);
            const json = await response.json();
            return json;
        } catch (error) {
            handleFetchError(
                error,
                "Could not delete post! Please try again later."
            );
        }
    }
);

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        resetPosts(state, action) {
            state.pageNumber = 1;
            state.hasMorePosts = true;
            postsAdapter.removeAll(state);
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = "pending";
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.pageNumber++;
                if (action.payload.length === 0) {
                    state.hasMorePosts = false;
                    // Since no more posts were loaded, we decrement the page number to reflect the true value.
                    state.pageNumber--;
                }
                postsAdapter.addMany(state, action.payload);
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message;
            })
            .addCase(fetchPostsByCategory.pending, (state, action) => {
                state.status = "pending";
            })
            .addCase(fetchPostsByCategory.fulfilled, (state, action) => {
                state.status = "fulfilled";
                postsAdapter.setAll(state, action.payload);
            })
            .addCase(fetchPostsByCategory.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message;
            })
            .addCase(fetchSinglePost.pending, (state, action) => {
                state.status = "pending";
            })
            .addCase(fetchSinglePost.fulfilled, (state, action) => {
                state.status = "fulfilled";
                postsAdapter.setOne(state, action.payload);
            })
            .addCase(fetchSinglePost.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message;
            })
            .addCase(voteOnPost.fulfilled, (state, action) => {
                postsAdapter.upsertOne(state, action.payload.post_data);
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                postsAdapter.addOne(state, action.payload);
            })
            .addCase(editPost.fulfilled, (state, action) => {
                state.editPostStatus = "fulfilled";
                postsAdapter.upsertOne(state, action.payload);
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                postsAdapter.removeOne(state, action.payload.id);
            });
    },
});

export default postsSlice.reducer;

export const { resetPosts } = postsSlice.actions;

export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds,
} = postsAdapter.getSelectors((state) => state.posts);

export const selectPostIdsByPageNumber = createSelector(
    [selectAllPosts],
    (posts) =>
        posts.map((post) => {
            return {
                id: post.id,
                pageNumber: post.page_number,
            };
        })
);
