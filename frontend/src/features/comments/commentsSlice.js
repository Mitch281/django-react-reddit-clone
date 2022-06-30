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
    makeCommentOnPostStatus: "idle",
    makeCommentOnPostError: null
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

export const makeCommentOnPost = createAsyncThunk(
    "comments/makeCommentOnPost",
    async (newComment) => {
        const response = await fetch(`${API_ENDPOINT}/comments/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify(newComment),
        });
        if (!response.ok) {
            Promise.reject("Could not make comment!");
        }
        const json = await response.json();
        return json;
    }
)

export const deleteComment = createAsyncThunk(
    "comments/deleteComment",
    async (deleteCommentInformation)  => {
        const { commentId, userId } = deleteCommentInformation;
        const patchInformation = {
            deleted: true,
        }

        const response = await fetch(
            `${API_ENDPOINT}/comment/id=${commentId}/user-id=${userId}/`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify(patchInformation),
            }
        );

        if (!response.ok) {
            return Promise.reject(response.status)
        };

        const json = await response.json();
        return json;
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
            .addCase(makeCommentOnPost.pending, (state, action) => {
                state.makeCommentOnPostStatus = "pending";
            })
            .addCase(makeCommentOnPost.rejected, (state, action) => {
                state.makeCommentOnPostStatus = "rejected";
                state.makeCommentOnPostError = action.error.message;
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
