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
});

export const fetchPosts = createAsyncThunk(
    "posts/fetchPosts",
    async (order) => {
        let url;
        if (order) {
            url = `${API_ENDPOINT}/posts/${order}`;
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
        const response = await fetch(`${API_ENDPOINT}/post/id=${postId}`);
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
                "Content-Type": "application/json"
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
                "Content-Type": "application/json"
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
            .addCase(fetchPostsByCategory.pending, state => state.status = "pending")
            .addCase(fetchPostsByCategory.fulfilled, (state, action) => {
                state.status = "fulfilled";
                postsAdapter.setAll(state, action.payload);
            })
            .addCase(fetchPostsByCategory.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message;
            })
            .addCase(fetchSinglePost.pending, state => state.status = "pending")
            .addCase(fetchSinglePost.fulfilled, (state, action) => {
                state.status = "fulfilled";
                postsAdapter.setOne(state, action.payload);
            })
            .addCase(fetchSinglePost.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message;
            })
            .addCase(upvotePost.fulfilled, (state, action) => {
                state.status = "fulfilled";
            })
            .addCase(upvotePost.rejected, (state, action) => {
                // We do not change status here because this would cause posts to unrender.
                state.error = action.error.message;
            })
    },
});

export default postsSlice.reducer;

export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds,
} = postsAdapter.getSelectors((state) => state.posts);
