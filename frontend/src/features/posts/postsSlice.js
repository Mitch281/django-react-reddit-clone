import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from "@reduxjs/toolkit";
import { authorisedFetchWrapper } from "../../common/utils/authorised-fetch-wrapper";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const postsAdapter = createEntityAdapter();

const initialState = postsAdapter.getInitialState({
    status: "idle",
    error: null,
});

export const fetchPosts = createAsyncThunk(
    "posts/fetchPosts",
    async (order) => {
        let url;
        if (order) {
            url = `${API_ENDPOINT}/posts/${order}/`;
        } else {
            url = `${API_ENDPOINT}/posts/`;
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

export const upvotePost = createAsyncThunk(
    "posts/upvotePost",
    async (postInformation) => {
        const { post, currentVote } = postInformation;
        const url = `${API_ENDPOINT}/post/${post.id}/`;
        const numUpvotes = post.num_upvotes;
        const numDownvotes = post.num_downvotes;
        let data;

        if (currentVote === "downvote") {
            data = {
                num_upvotes: numUpvotes + 1,
                num_downvotes: numDownvotes - 1,
            };
        } else if (currentVote === "upvote") {
            data = { num_upvotes: numUpvotes - 1 };
        } else {
            data = { num_upvotes: numUpvotes + 1 };
        }

        try {
            const response = await authorisedFetchWrapper.patch(url, data);
            const json = await response.json();
            return json;
        } catch (error) {
            return Promise.reject(error);
        }
    }
);

export const downvotePost = createAsyncThunk(
    "posts/downvotePost",
    async (postInformation) => {
        const { post, currentVote } = postInformation;
        const url = `${API_ENDPOINT}/post/${post.id}/`;
        const numUpvotes = post.num_upvotes;
        const numDownvotes = post.num_downvotes;
        let data;

        if (currentVote === "upvote") {
            data = {
                num_upvotes: numUpvotes - 1,
                num_downvotes: numDownvotes + 1,
            };
        } else if (currentVote === "downvote") {
            data = { num_downvotes: numDownvotes - 1 };
        } else {
            data = { num_downvotes: numDownvotes + 1 };
        }

        try {
            const response = await authorisedFetchWrapper.patch(url, data);
            const json = await response.json();
            return json;
        } catch (error) {
            return Promise.reject(error);
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
            return Promise.reject(error);
        }
    }
);

export const editPost = createAsyncThunk(
    "posts/editPost",
    async (editPostInformation) => {
        const { postId, userId, newPostContent } = editPostInformation;
        const patchData = { content: newPostContent }
        const url = `${API_ENDPOINT}/post/${postId}/user-id=${userId}/`;
        try {
            const response = await authorisedFetchWrapper.patch(url, patchData);
            const json = await response.json();
            return json;
        } catch (error) {
            return Promise.reject(error);
        }
    }
);

export const deletePost = createAsyncThunk(
    "posts/deletePost",
    async (deleteInformation) => {
        const { postId, userId } = deleteInformation;
        const url = `${API_ENDPOINT}/post/${postId}/user-id=${userId}/`;
        try {
            const response = await authorisedFetchWrapper.delete(url);
            const json = await response.json();
            return json;
        } catch (error) {
            return Promise.reject(error);
        }
    }
);

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = "pending";
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = "fulfilled";
                postsAdapter.setAll(state, action.payload);
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
            .addCase(upvotePost.fulfilled, (state, action) => {
                postsAdapter.upsertOne(state, action.payload);
            })
            .addCase(downvotePost.fulfilled, (state, action) => {
                postsAdapter.upsertOne(state, action.payload);
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

export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds,
} = postsAdapter.getSelectors((state) => state.posts);
