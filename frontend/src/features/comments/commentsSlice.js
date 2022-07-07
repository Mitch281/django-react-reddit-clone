import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from "@reduxjs/toolkit";
import { authorisedFetchWrapper } from "../../common/utils/authorised-fetch-wrapper";

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
            url = `${API_ENDPOINT}/post/${postId}/comments/${order}/`;
        } else {
            url = `${API_ENDPOINT}/post/${postId}/comments/`;
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
        const url = `${API_ENDPOINT}/comment/${comment.id}/`;
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

        try {
            const response = await authorisedFetchWrapper.patch(url, data);
            const json = await response.json();
            return json;
        } catch (error) {
            return Promise.reject(error);
        }
    }
);

export const downvoteComment = createAsyncThunk(
    "comments/downvoteComment",
    async (commentInformation) => {
        const { comment, currentVote } = commentInformation;
        const url = `${API_ENDPOINT}/comment/${comment.id}/`;
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

        try {
            const response = await authorisedFetchWrapper.patch(url, data);
            const json = await response.json();
            return json;
        } catch (error) {
            return Promise.reject(error);
        }
    }
)

export const makeCommentOnPost = createAsyncThunk(
    "comments/makeCommentOnPost",
    async (newComment) => {
        const url = `${API_ENDPOINT}/comments/`;
        try {
            const response = await authorisedFetchWrapper.post(url, newComment);
            const json = await response.json();
            return json;
        } catch (error) {
            return Promise.reject(error);
        }
    }
)

export const deleteComment = createAsyncThunk(
    "comments/deleteComment",
    async (deleteCommentInformation)  => {
        const { commentId, userId } = deleteCommentInformation;
        const patchInformation = {
            deleted: true,
        }
        const url = `${API_ENDPOINT}/comment/${commentId}?user-id=${userId}/`;

        try {
            const response = await authorisedFetchWrapper.patch(url, patchInformation);
            const json = await response.json();
            return json;
        } catch (error) {
            return Promise.reject(error);
        }
    }
)

const commentsSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {
        toggleHidden: {
            reducer(state, action) {
                commentsAdapter.updateOne(state, action.payload);
            }, 
            prepare(commentId, isHidden) {
                return {
                    payload: {
                        id: commentId,
                        changes: {
                            is_hidden: !isHidden
                        }
                    }
                }
            }
        },
        // We must increment the number of replies manually everytime a user replies due to the rendering behaviour of 
        // comment replies. Particularly, replies render only if the number of replies is above 0. Thus, on the first reply
        // of a comment, if we do not manually increment the number of replies, the reply will not render.
        incrementNumReplies: {
            reducer(state, action) {
                commentsAdapter.updateOne(state, action.payload);
            },
            prepare(parentCommentId, currentNumReplies) {
                return {
                    payload: {
                        id: parentCommentId,
                        changes: {
                            num_replies: currentNumReplies + 1
                        }
                    }
                }
            }
        }
    },
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
            .addCase(makeCommentOnPost.fulfilled, (state, action) => {
                state.makeCommentOnPostStatus = "fulfilled";
                commentsAdapter.addOne(state, action.payload);
            })
            // Upsert works but update doesn't? Look into this.
            .addCase(deleteComment.fulfilled, (state, action) => {
                commentsAdapter.upsertOne(state, action.payload);
            })
    }     
});

export default commentsSlice.reducer;

export const { toggleHidden, incrementNumReplies } = commentsSlice.actions;

export const {
    selectAll: selectAllComments,
    selectById: selectCommentById,
    selectIds: selectCommentIds
} = commentsAdapter.getSelectors(state => state.comments);
