import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from "@reduxjs/toolkit";
import { v4 as uuid_v4 } from "uuid";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const usersVotesOnPostsAdapter = createEntityAdapter();

const initialState = usersVotesOnPostsAdapter.getInitialState({
    status: "idle",
    error: null,
});

export const fetchUsersVotesOnPosts = createAsyncThunk(
    "usersVotesOnPosts/fetchUsersVotesOnPosts",
    async (userId) => {
        const response = await fetch(
            `${API_ENDPOINT}/post-votes?user=${userId}`
        );
        const json = await response.json();
        return json;
    }
);

export const trackUsersUpvote = createAsyncThunk(
    "usersVotesOnPosts/trackUsersUpvote",
    async (upvoteInformation) => {
        const { usersVoteOnPostId, currentVote, userId, postId } =
            upvoteInformation;
        let data;
        let url;
        let method;

        // User has voted already
        if (usersVoteOnPostId) {
            url = `${API_ENDPOINT}/post-vote/${usersVoteOnPostId}/`;
            method = "PATCH";
            if (currentVote === "upvote") {
                data = { upvote: false };
            } else if (currentVote === "downvote") {
                data = {
                    upvote: true,
                    downvote: false,
                };
            } else {
                data = { upvote: true };
            }
        } else {
            url = `${API_ENDPOINT}/post-votes/`;
            method = "POST";
            data = {
                id: uuid_v4(),
                upvote: true,
                downvote: false,
                user: userId,
                post: postId,
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
    "usersVotesOnPosts/trackUsersDownvote",
    async (downvoteInformation) => {
        const { usersVoteOnPostId, currentVote, userId, postId } =
            downvoteInformation;
        let data;
        let url;
        let method;

        console.log(currentVote);

        // User has voted already.
        if (usersVoteOnPostId) {
            url = `${API_ENDPOINT}/post-vote/${usersVoteOnPostId}/`;
            method = "PATCH";
            if (currentVote === "downvote") {
                data = { downvote: false };
            } else if (currentVote === "upvote") {
                data = {
                    upvote: false,
                    downvote: true,
                };
            } else {
                data = { downvote: true };
            }
        } else {
            url = `${API_ENDPOINT}/post-votes/`;
            method = "POST";
            data = {
                id: uuid_v4(),
                upvote: false,
                downvote: true,
                user: userId,
                post: postId,
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

const usersVotesOnPostsSlice = createSlice({
    name: "usersVotesOnPosts",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchUsersVotesOnPosts.pending, (state, action) => {
                state.status = "pending";
            })
            .addCase(fetchUsersVotesOnPosts.fulfilled, (state, action) => {
                state.status = "fulfilled";
                usersVotesOnPostsAdapter.setAll(state, action.payload);
            })
            .addCase(fetchUsersVotesOnPosts.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message;
            })
            .addCase(trackUsersUpvote.fulfilled, (state, action) => {
                usersVotesOnPostsAdapter.upsertOne(state, action.payload);
            })
            .addCase(trackUsersDownvote.fulfilled, (state, action) => {
                usersVotesOnPostsAdapter.upsertOne(state, action.payload);
            })
    },
});

export default usersVotesOnPostsSlice.reducer;

export const {
    selectAll: selectAllUsersVotesOnPosts,
    selectById: selectUsersVoteOnPostById,
    selectIds: selectUsersVoteOnPostsIds,
} = usersVotesOnPostsAdapter.getSelectors((state) => state.usersVotesOnPosts);
