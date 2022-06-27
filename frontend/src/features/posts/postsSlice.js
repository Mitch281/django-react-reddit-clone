import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from "@reduxjs/toolkit";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const postsAdapter = createEntityAdapter();

const initialState = postsAdapter.getInitialState({
    status: "idle",
    error: null,
    editPostStatus: "idle",
    editPostError: null,
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
            url = `${API_ENDPOINT}/posts/category=${categoryId}/${order}/`;
        } else {
            url = `${API_ENDPOINT}/posts/category=${categoryId}/`;
        }
        const response = await fetch(url);
        const json = await response.json();
        return json;
    }
);

export const fetchSinglePost = createAsyncThunk(
    "posts/fetchSinglePost",
    async (postId) => {
        const response = await fetch(`${API_ENDPOINT}/post/id=${postId}/`);
        const json = await response.json();
        return json;
    }
);

export const upvotePost = createAsyncThunk(
    "posts/upvotePost",
    async (postInformation) => {
        const { post, currentVote } = postInformation;
        const url = `${API_ENDPOINT}/post/id=${post.id}/`;
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

        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            const json = await response.json();
            return json;
        } else {
            return Promise.reject("Could not upvote!");
        }
    }
);

export const downvotePost = createAsyncThunk(
    "posts/downvotePost",
    async (postInformation) => {
        const { post, currentVote } = postInformation;
        const url = `${API_ENDPOINT}/post/id=${post.id}/`;
        const numUpvotes = post.num_upvotes;
        const numDownvotes = post.num_downvotes;
        let data;

        if (currentVote === "upvote") {
            data = {
                num_upvotes: numUpvotes - 1,
                num_downvotes: numDownvotes + 1
            }
        } else if (currentVote === "downvote") {
            data = { num_downvotes: numDownvotes - 1};
        } else {
            data = { num_downvotes: numDownvotes + 1};
        }

        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            const json = await response.json();
            return json;
        } else {
            return Promise.reject("Could not downvote!");
        }
    }
)

export const editPost = createAsyncThunk(
    "posts/editPost",
    async (editPostInformation) => {
        const { postId, userId, newPostContent } = editPostInformation;
        const response = await fetch(`${API_ENDPOINT}/post/id=${postId}/user-id=${userId}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: JSON.stringify({ content: newPostContent })
        });
        if (!response.ok) {
            Promise.reject(response.status);
        }
        const json = await response.json();
        return json;
    }
)

export const deletePost = createAsyncThunk(
    "posts/deletePost",
    async (deleteInformation) => {
        const { postId, userId } = deleteInformation;
        const response = await fetch(`${API_ENDPOINT}/post/id=${postId}/user-id=${userId}/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        });
        if (!response.ok) {
            return Promise.reject(response.status);
        }
        const json = await response.json();
        return json;
    }
)

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
                state.status = "pending"
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
                state.status = "pending"
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
            .addCase(editPost.fulfilled, (state, action) => {
                state.editPostStatus = "fulfilled";
                postsAdapter.upsertOne(state, action.payload);
            })
            .addCase(editPost.pending, (state, action) => {
                state.editPostStatus = "pending";
            })
            .addCase(editPost.rejected, (state, action) => {
                state.editPostStatus = "rejected";
                state.editPostError = action.error.message;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                postsAdapter.removeOne(state, action.payload.id);
            })
    },
});

export default postsSlice.reducer;

export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds,
} = postsAdapter.getSelectors((state) => state.posts);
