import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from "@reduxjs/toolkit";
import { v4 as uuid_v4 } from "uuid";
import { VoteTypes } from "../../utils/constants";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const usersVotesOnCommentsAdapter = createEntityAdapter();

const initialState = usersVotesOnCommentsAdapter.getInitialState({
    status: "idle",
    error: null,
});

export const fetchUsersVotesOnComments = createAsyncThunk(
    "usersVotesOnComments/fetchUsersVotesOnComments",
    async (userId) => {
        const response = await fetch(
            `${API_ENDPOINT}/comment-votes?user=${userId}`
        );
        const json = await response.json();
        return json;
    }
);

export const trackUsersUpvote = createAsyncThunk(
    "usersVotesOnComments/trackUsersUpvote",
    async (upvoteInformation) => {
        const { usersVoteOnCommentId, currentVote, userId, commentId } =
            upvoteInformation;
        let data;
        let url;
        let method;

        if (usersVoteOnCommentId) {
            url = `${API_ENDPOINT}/comment-vote/${usersVoteOnCommentId}/`;
            method = "PATCH";
            if ((currentVote === VoteTypes.Upvote)) {
                data = { upvote: false };
            } else if ((currentVote === VoteTypes.Downvote)) {
                data = {
                    upvote: true,
                    downvote: false,
                };
            } else {
                data = { upvote: true };
            }
        } else {
            url = `${API_ENDPOINT}/comment-votes/`;
            method = "POST";
            data = {
                id: uuid_v4(),
                upvote: true,
                downvote: false,
                user: userId,
                comment: commentId,
            };
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            Promise.reject("Could not upvote!");
        }
        const json = await response.json();
        return json;
    }
);

export const trackUsersDownvote = createAsyncThunk(
    "usersVotesOnComments/trackUsersDownvote",
    async (downvoteInformation) => {
        const { usersVoteOnCommentId, currentVote, userId, commentId } =
            downvoteInformation;
        let data;
        let url;
        let method;

        if (usersVoteOnCommentId) {
            url = `${API_ENDPOINT}/comment-vote/${usersVoteOnCommentId}/`;
            method = "PATCH";
            if (currentVote === VoteTypes.Downvote) {
                data = { downvote: false };
            } else if ((currentVote === VoteTypes.Upvote)) {
                data = {
                    upvote: false,
                    downvote: true,
                };
            } else {
                data = { downvote: true };
            }
        } else {
            url = `${API_ENDPOINT}/comment-votes/`;
            method = "POST";
            data = {
                id: uuid_v4(),
                upvote: false,
                downvote: true,
                user: userId,
                comment: commentId,
            };
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            Promise.reject("Could not downvote!");
        }
        const json = await response.json();
        return json;
    }
);

const usersVotesOnCommentsSlice = createSlice({
    name: "usersVotesOnComments",
    initialState,
    reducers: {
        trackUsersVote(state, action) {
            usersVotesOnCommentsAdapter.upsertOne(state, action.payload);
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchUsersVotesOnComments.pending, (state, action) => {
                state.status = "pending";
            })
            .addCase(fetchUsersVotesOnComments.fulfilled, (state, action) => {
                state.status = "fulfilled";
                usersVotesOnCommentsAdapter.setAll(state, action.payload);
            })
            .addCase(fetchUsersVotesOnComments.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message;
            })
            .addCase(trackUsersUpvote.fulfilled, (state, action) => {
                usersVotesOnCommentsAdapter.upsertOne(state, action.payload);
            })
            .addCase(trackUsersDownvote.fulfilled, (state, action) => {
                usersVotesOnCommentsAdapter.upsertOne(state, action.payload);
            })
    }
});

export default usersVotesOnCommentsSlice.reducer;

export const { trackUsersVote } = usersVotesOnCommentsSlice.actions;

export const {
    selectAll: selectAllUsersVotesOnComments,
    selectById: selectUsersVoteOnCommentById,
    selectIds: selectUsersVoteOnCommentsIds,
} = usersVotesOnCommentsAdapter.getSelectors(
    (state) => state.usersVotesOnComments
);
