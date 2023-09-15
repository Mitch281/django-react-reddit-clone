import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { AddCategoryResponse } from "../../types/api";
import { Category, CreateCategoryPayload } from "../../types/shared";
import { handleFetchError } from "../../utils/auth";
import { authorisedFetchWrapper } from "../../utils/authorised-fetch-wrapper";

type State = {
    status: "idle" | "pending" | "fulfilled" | "rejected";
    error: string | null;
    entities?: Category[];
};

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const categoriesAdapter = createEntityAdapter();

const initialState = categoriesAdapter.getInitialState<State>({
    status: "idle",
    error: null,
});

export const fetchCategories = createAsyncThunk(
    "categories/fetchCategories",
    async (): Promise<Category[]> => {
        const response = await fetch(`${API_ENDPOINT}/categories/`);
        if (!response.ok) {
            return Promise.reject(response.status);
        }
        const json: Category[] = await response.json();
        return json;
    }
);

export const createCategory = createAsyncThunk(
    "categories/createCategory",
    async (newCategory: CreateCategoryPayload) => {
        const url = `${API_ENDPOINT}/categories/`;
        try {
            const json: AddCategoryResponse = await authorisedFetchWrapper.post(
                url,
                newCategory
            );
            return json;
        } catch (error) {
            handleFetchError(
                error as Error,
                "Could not create category! Please try again later."
            );
        }
    }
);

const categoriesSlice = createSlice({
    name: "categories",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchCategories.pending, (state, action) => {
                state.status = "pending";
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = "fulfilled";
                categoriesAdapter.setAll(state, action.payload);
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message as string;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                categoriesAdapter.addOne(state, action.payload);
            });
    },
});

export default categoriesSlice.reducer;

export const {
    selectAll: selectAllCategories,
    selectById: selectCategoryById,
    selectIds: selectCategoryIds,
} = categoriesAdapter.getSelectors((state: RootState) => state.categories);
