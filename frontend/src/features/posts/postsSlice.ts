import {
    createAsyncThunk,
    createEntityAdapter,
    createSelector,
    createSlice,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
    AddPostResponse,
    DeletePostResponse,
    PatchPostBody,
    PatchPostResponse,
    PostVoteResponse,
} from "../../types/api";
import {
    AddPostBody,
    DeletePostPayload,
    EditPostPayload,
    FetchPostsByCategoryPayload,
    FetchPostsPayload,
    Post,
    VoteOnPostPayload,
} from "../../types/shared";
import { handleFetchError } from "../../utils/auth";
import { authorisedFetchWrapper } from "../../utils/authorised-fetch-wrapper";
import { constants } from "../../utils/constants";

type State = {
    status: "idle" | "pending" | "fulfilled" | "rejected";
    error: string | null;
    hasMorePosts: boolean;
    pageNumber: number;
    entities?: Post[];
};

const API_ENDPOINT = import.meta.env.VITE_APP_API_ENDPOINT;

const postsAdapter = createEntityAdapter();

const initialState = postsAdapter.getInitialState<State>({
    status: "idle",
    error: null,
    hasMorePosts: true,
    pageNumber: 1,
});

export const fetchPosts = createAsyncThunk(
    "posts/fetchPosts",
    async (fetchInformation: FetchPostsPayload) => {
        const { order, pageNumber } = fetchInformation;
        let url;
        if (order) {
            url = `${API_ENDPOINT}/posts/${order}/?limit=${constants.POSTS_PER_PAGE}&page-number=${pageNumber}`;
        } else {
            url = `${API_ENDPOINT}/posts/?limit=${constants.POSTS_PER_PAGE}&page-number=${pageNumber}`;
        }
        const response = await fetch(url);
        const json: Post[] = await response.json();
        return json;
    }
);

export const fetchPostsByCategory = createAsyncThunk(
    "posts/fetchPostsByCategory",
    async (fetchInformation: FetchPostsByCategoryPayload) => {
        const { order, categoryId, pageNumber } = fetchInformation;
        let url;
        if (order) {
            url = `${API_ENDPOINT}/posts/category/${categoryId}/${order}?limit=${constants.POSTS_PER_PAGE}&page-number=${pageNumber}`;
        } else {
            url = `${API_ENDPOINT}/posts/category/${categoryId}?limit=${constants.POSTS_PER_PAGE}&page-number=${pageNumber}`;
        }
        const response = await fetch(url);
        const json: Post[] = await response.json();
        return json;
    }
);

export const fetchSinglePost = createAsyncThunk(
    "posts/fetchSinglePost",
    async (postId: string) => {
        const response = await fetch(`${API_ENDPOINT}/post/${postId}/`);
        const json = await response.json();
        return json;
    }
);

export const voteOnPost = createAsyncThunk(
    "posts/voteOnPost",
    async (
        voteData: VoteOnPostPayload
    ): Promise<PostVoteResponse | undefined> => {
        const { postId, usersVoteOnPostId, data } = voteData;
        let url;
        if (usersVoteOnPostId) {
            url = `${API_ENDPOINT}/post/${postId}/vote/vote-id=${usersVoteOnPostId}/`;
        } else {
            // User has not voted on post yet.
            url = `${API_ENDPOINT}/post/${postId}/vote/vote-id=/`;
        }
        try {
            const json: PostVoteResponse = await authorisedFetchWrapper.put(
                url,
                data
            );
            return json;
        } catch (error) {
            handleFetchError(
                error as Error,
                "Could not vote on post! Please try again later."
            );
        }
    }
);

export const addNewPost = createAsyncThunk(
    "posts/addNewPost",
    async (newPost: AddPostBody): Promise<AddPostResponse | undefined> => {
        const url = `${API_ENDPOINT}/posts/`;
        try {
            const json: AddPostResponse = await authorisedFetchWrapper.post<
                AddPostBody,
                AddPostResponse
            >(url, newPost);
            return json;
        } catch (error) {
            handleFetchError(
                error as Error,
                "Could not add new post! Please try again later."
            );
        }
    }
);

export const editPost = createAsyncThunk(
    "posts/editPost",
    async (editPostInformation: EditPostPayload) => {
        const { postId, userId, newPostContent } = editPostInformation;
        const patchData: PatchPostBody = { content: newPostContent };
        const url = `${API_ENDPOINT}/post/${postId}/?user-id=${userId}`;
        try {
            const json: PatchPostResponse = await authorisedFetchWrapper.patch<
                PatchPostBody,
                PatchPostResponse
            >(url, patchData);
            return json;
        } catch (error) {
            handleFetchError(
                error as Error,
                "Could not edit post! Please try again later."
            );
        }
    }
);

export const deletePost = createAsyncThunk(
    "posts/deletePost",
    async (
        deleteInformation: DeletePostPayload
    ): Promise<DeletePostResponse | undefined> => {
        const { postId, userId } = deleteInformation;
        const url = `${API_ENDPOINT}/post/${postId}/?user-id=${userId}`;
        try {
            const json: DeletePostResponse =
                await authorisedFetchWrapper.delete(url);
            return json;
        } catch (error) {
            handleFetchError(
                error as Error,
                "Could not delete post! Please try again later."
            );
        }
    }
);

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        resetPosts(state, action) {
            state.pageNumber = 1;
            state.hasMorePosts = true;
            postsAdapter.removeAll(state);
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = "pending";
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.pageNumber++;
                if (action.payload.length === 0) {
                    state.hasMorePosts = false;
                    // Since no more posts were loaded, we decrement the page number to reflect the true value.
                    state.pageNumber--;
                }
                postsAdapter.addMany(state, action.payload);
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message as string;
            })
            .addCase(fetchPostsByCategory.pending, (state, action) => {
                state.status = "pending";
            })
            .addCase(fetchPostsByCategory.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.pageNumber++;
                if (action.payload.length === 0) {
                    state.hasMorePosts = false;
                    state.pageNumber--;
                }
                postsAdapter.addMany(state, action.payload);
            })
            .addCase(fetchPostsByCategory.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message as string;
            })
            .addCase(fetchSinglePost.pending, (state, action) => {
                state.status = "pending";
            })
            .addCase(fetchSinglePost.fulfilled, (state, action) => {
                state.status = "fulfilled";
                postsAdapter.setOne(state, action.payload);
            })
            .addCase(fetchSinglePost.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message as string;
            })
            .addCase(voteOnPost.fulfilled, (state, action) => {
                postsAdapter.upsertOne(state, action.payload!.post_data);
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                postsAdapter.addOne(state, action.payload);
            })
            .addCase(editPost.fulfilled, (state, action) => {
                postsAdapter.upsertOne(state, action.payload);
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                postsAdapter.removeOne(state, action.payload!.id);
            });
    },
});

export default postsSlice.reducer;

export const { resetPosts } = postsSlice.actions;

export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds,
} = postsAdapter.getSelectors((state: RootState) => state.posts);

export const selectPostIdsByPageNumber = createSelector(
    [selectAllPosts],
    (posts) =>
        (posts as Post[]).map((post) => {
            return {
                id: post.id,
                pageNumber: post.page_number,
            };
        })
);
