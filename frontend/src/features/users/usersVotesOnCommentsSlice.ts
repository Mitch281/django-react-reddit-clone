import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { UsersVoteOnComment } from "../../types/shared";

type State = {
    status: "idle" | "pending" | "fulfilled" | "rejected";
    error: string | null;
    entities?: UsersVoteOnComment[];
};

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const usersVotesOnCommentsAdapter = createEntityAdapter();

const initialState = usersVotesOnCommentsAdapter.getInitialState<State>({
    status: "idle",
    error: null,
});

export const fetchUsersVotesOnComments = createAsyncThunk(
    "usersVotesOnComments/fetchUsersVotesOnComments",
    async (userId: string) => {
        const response = await fetch(
            `${API_ENDPOINT}/comment-votes?user=${userId}`
        );
        const json: UsersVoteOnComment[] = await response.json();
        return json;
    }
);

const usersVotesOnCommentsSlice = createSlice({
    name: "usersVotesOnComments",
    initialState,
    reducers: {
        trackUsersVote(state, action) {
            usersVotesOnCommentsAdapter.upsertOne(state, action.payload);
        },
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
                state.error = action.error.message as string;
            });
    },
});

export default usersVotesOnCommentsSlice.reducer;

export const { trackUsersVote } = usersVotesOnCommentsSlice.actions;

export const {
    selectAll: selectAllUsersVotesOnComments,
    selectById: selectUsersVoteOnCommentById,
    selectIds: selectUsersVoteOnCommentsIds,
} = usersVotesOnCommentsAdapter.getSelectors(
    (state: RootState) => state.usersVotesOnComments
);
