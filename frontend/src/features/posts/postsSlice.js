import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const postsAdapter = createEntityAdapter();

const initialState = postsAdapter.getInitialState({
    status: "idle",
    error: null
});

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async (order) => {
    let url;
    if (order) {
        url = `${API_ENDPOINT}/posts/${order}`;
    } else {
        url = `${API_ENDPOINT}/posts/`;
    }
    const response = await fetch(url);
    const json = await response.json();
    return json;
});

export const fetchPostsByCategory = createAsyncThunk("posts/fetchPostsByCategory", async (fetchInformation) => {
    const { order, categoryId }= fetchInformation;
    let url;
    if (order) {
        url = `${API_ENDPOINT}/posts/category=${categoryId}/${order}/`;
    } else {
        url = `${API_ENDPOINT}/posts/category=${categoryId}/`;
    }
    const response = await fetch(url);
    const json = await response.json();
    return json;
})

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
    }
});

export default postsSlice.reducer;

export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
} = postsAdapter.getSelectors(state => state.posts);