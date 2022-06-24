import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from "@reduxjs/toolkit";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const usersVotesOnPostsAdapter = createEntityAdapter();

const initialState = usersVotesOnPostsAdapter.getInitialState({
    status: "idle",
    error: null,
});

export const fetchUsersVotesOnPosts = createAsyncThunk(
    "usersVotesOnPosts/fetchUsersVotesOnPosts",
    async (userId) => {
        const response = await fetch(`${API_ENDPOINT}/post-votes?user=${userId}`);
        const json = await response.json();
        return json;
    }
)

export const trackUsersUpvote = createAsyncThunk(
    "usersVotesOnPosts/trackUsersUpvote",
    async (upvoteInformation) => {
        const { usersVoteOnPostId, usersCurrentVote } = upvoteInformation;
        let data;
        let url;
        let method;

        // User has voted already
        if (usersVoteOnPostId) {
            url = `${API_ENDPOINT}/post-vote/${usersVoteOnPostId}/`;
            method = "PATCH";
            if (usersCurrentVote === "upvote") {
                data = {upvote: false };
            } else if (usersCurrentVote === "downvote") {
                data = {
                    upvote: true,
                    downvote: false
                }
            } else {
                data = { upvote: true }
            }
        } else {
            url = `${API_ENDPOINT}/post-votes/`;
            method = "POST";
            data = { upvote: true }
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
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
        const { usersVoteOnPostId, usersCurrentVote } = downvoteInformation;
        let data;
        let url;
        let method;

        // User has voted already.
        if (usersVoteOnPostId) {
            url = `${API_ENDPOINT}/post-vote/${usersVoteOnPostId}/`;
            method = "PATCH";
            if (usersCurrentVote === "downvote") {
                data = { downvote: false };
            } else if (usersCurrentVote === "upvote") {
                data = {
                    upvote: false,
                    downvote: true
                };
            } else {
                data = { downvote: true }
            }
        } else {
            url = `${API_ENDPOINT}/post-votes/`;
            method = "POST";
            data = { downvote: true }
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            Promise.reject("Could not upvote!");
        }
        const json = await response.json();
        return json;
    }
)

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
    }
});

export default usersVotesOnPostsSlice.reducer;

export const {
    selectAll: selectAllUsersVotesOnPosts,
    selectById: selectUsersVoteOnPostById,
    selectIds: selectUsersVoteOnPostsIds
} = usersVotesOnPostsAdapter.getSelectors((state) => state.usersVotesOnPosts);