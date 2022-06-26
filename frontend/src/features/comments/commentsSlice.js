import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from "@reduxjs/toolkit";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const commentsAdapter = createEntityAdapter();

const initialState = commentsAdapter.getInitialState({
    status: "idle",
    error: null,
});

export const fetchComments = createAsyncThunk(
    "comments/fetchComments",
    async (commentsInformation) => {
        const { order, postId } = commentsInformation;
        let url;
        if (order) {
            url = `${API_ENDPOINT}/comments/post=${postId}/${order}/`;
        } else {
            url = `${API_ENDPOINT}/comments/post=${postId}/`;
        }
        const response = await fetch(url);
        const json = await response.json();
        return json;
    }
)

export const upvoteComment = createAsyncThunk(
    "comments/upvoteComment",
    async (commentInformation) => {
        const { comment, currentVote } = commentInformation;
        const url = `${API_ENDPOINT}/comment/id=${comment.id}/`;
        const numUpvotes = comment.num_upvotes;
        const numDownvotes = comment.num_downvotes;
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
            Promise.reject("Could not upvote!");
        }
    }
);

export const downvoteComment = createAsyncThunk(
    "comments/downvoteComment",
    async (commentInformation) => {
        const { comment, currentVote } = commentInformation;
        const url = `${API_ENDPOINT}/comment/id=${comment.id}/`;
        const numUpvotes = comment.num_upvotes;
        const numDownvotes = comment.num_downvotes;
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

const commentsSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchComments.pending, (state, action) => {
                state.status = "pending";
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.status = "fulfilled";
                commentsAdapter.setAll(state, action.payload);
            })
            .addCase(fetchComments.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message;
            })
            .addCase(upvoteComment.fulfilled, (state, action) => {
                commentsAdapter.upsertOne(state, action.payload);
            })
            .addCase(downvoteComment.fulfilled, (state, action) => {
                commentsAdapter.upsertOne(state, action.payload);
            })
    }     
});

export default commentsSlice.reducer;

export const {
    selectAll: selectAllComments,
    selectById: selectCommentById,
    selectIds: selectCommentIds
} = commentsAdapter.getSelectors(state => state.comments);
