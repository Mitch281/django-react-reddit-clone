import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
    AddCommentResponse,
    DeleteCommentBody,
    DeleteCommentResponse,
    PatchCommentBody,
    PatchCommentResponse,
} from "../../types/api";
import {
    AddCommentBody,
    DeleteCommentPayload,
    EditCommentPayload,
    FetchCommentsPayload,
} from "../../types/shared";
import { handleFetchError } from "../../utils/auth";
import { authorisedFetchWrapper } from "../../utils/authorised-fetch-wrapper";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const commentsAdapter = createEntityAdapter();

const initialState = commentsAdapter.getInitialState({
    status: "idle",
    error: null,
});

export const fetchComments = createAsyncThunk(
    "comments/fetchComments",
    async (commentsInformation: FetchCommentsPayload) => {
        const { order, postId } = commentsInformation;
        let url;
        if (order) {
            url = `${API_ENDPOINT}/post/${postId}/comments/${order}/`;
        } else {
            url = `${API_ENDPOINT}/post/${postId}/comments/`;
        }
        const response = await fetch(url);
        const json: Comment[] = await response.json();
        return json;
    }
);

export const voteOnComment = createAsyncThunk(
    "comments/voteOnComment",
    async (voteData) => {
        const { commentId, usersVoteOnCommentId, data } = voteData;
        let url;
        if (usersVoteOnCommentId) {
            url = `${API_ENDPOINT}/comment/${commentId}/vote/vote-id=${usersVoteOnCommentId}/`;
        } else {
            url = `${API_ENDPOINT}/comment/${commentId}/vote/vote-id=/`;
        }
        try {
            const json = await authorisedFetchWrapper.put(url, data);
            return json;
        } catch (error) {
            handleFetchError(
                error,
                "Could not vote on comment! Please try again later."
            );
        }
    }
);

export const makeCommentOnPost = createAsyncThunk(
    "comments/makeCommentOnPost",
    async (newComment: AddCommentBody) => {
        const url = `${API_ENDPOINT}/comments/`;
        try {
            const json: AddCommentResponse = await authorisedFetchWrapper.post<
                AddCommentBody,
                AddCommentResponse
            >(url, newComment);
            return json;
        } catch (error) {
            handleFetchError(
                error,
                "Could not comment on post! Please try again later."
            );
        }
    }
);

export const editComment = createAsyncThunk(
    "comments/editComment",
    async (editCommentInformation: EditCommentPayload) => {
        const { commentId, userId, newCommentContent } = editCommentInformation;
        const patchData: PatchCommentBody = { content: newCommentContent };
        const url = `${API_ENDPOINT}/comment/${commentId}/?user-id=${userId}`;

        try {
            const json: PatchCommentResponse =
                await authorisedFetchWrapper.patch<
                    PatchCommentBody,
                    PatchCommentResponse
                >(url, patchData);
            return json;
        } catch (error) {
            handleFetchError(
                error,
                "Could not edit comment! Please try again later."
            );
        }
    }
);

export const deleteComment = createAsyncThunk(
    "comments/deleteComment",
    async (deleteCommentInformation: DeleteCommentPayload) => {
        const { commentId, userId } = deleteCommentInformation;
        const patchInformation: DeleteCommentBody = {
            deleted: true,
        };
        // TODO: Why is it that when I don't append slash infront of comment id, I get a did not append slash error in Django? Find out!!
        // Also, if I append slash to url below, I get same error, but this does not happen for delete request (for example, deleting post). Why??
        const url = `${API_ENDPOINT}/comment/${commentId}/?user-id=${userId}`;

        try {
            const json: DeleteCommentResponse =
                await authorisedFetchWrapper.patch<
                    DeleteCommentBody,
                    DeleteCommentResponse
                >(url, patchInformation);
            return json;
        } catch (error) {
            handleFetchError(
                error,
                "Could not delete comment! Please try again later."
            );
        }
    }
);

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
                            is_hidden: !isHidden,
                        },
                    },
                };
            },
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
                            num_replies: currentNumReplies + 1,
                        },
                    },
                };
            },
        },
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
            .addCase(voteOnComment.fulfilled, (state, action) => {
                commentsAdapter.upsertOne(state, action.payload.comment_data);
            })
            .addCase(makeCommentOnPost.fulfilled, (state, action) => {
                state.makeCommentOnPostStatus = "fulfilled";
                commentsAdapter.addOne(state, action.payload);
            })
            .addCase(editComment.fulfilled, (state, action) => {
                commentsAdapter.upsertOne(state, action.payload);
            })
            // Upsert works but update doesn't? Look into this.
            .addCase(deleteComment.fulfilled, (state, action) => {
                commentsAdapter.upsertOne(state, action.payload);
            });
    },
});

export default commentsSlice.reducer;

export const { toggleHidden, incrementNumReplies, trackUsersVote } =
    commentsSlice.actions;

export const {
    selectAll: selectAllComments,
    selectById: selectCommentById,
    selectIds: selectCommentIds,
} = commentsAdapter.getSelectors((state: RootState) => state.comments);
