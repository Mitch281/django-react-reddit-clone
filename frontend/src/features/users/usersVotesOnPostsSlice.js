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

const usersVotesOnPostsSlice = createSlice({
    name: "usersVotesOnPosts",
    initialState,
    reducers: {
        trackUsersVote(state, action) {
            usersVotesOnPostsAdapter.upsertOne(state, action.payload);
        }
    },
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
    },
});

export default usersVotesOnPostsSlice.reducer;

export const { trackUsersVote } = usersVotesOnPostsSlice.actions;

export const {
    selectAll: selectAllUsersVotesOnPosts,
    selectById: selectUsersVoteOnPostById,
    selectIds: selectUsersVoteOnPostsIds,
} = usersVotesOnPostsAdapter.getSelectors((state) => state.usersVotesOnPosts);
