import { baseURL } from '@/utils/urls';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils/types';

export type TIngredientWithCounter = TIngredient & { count: number };

type ApiResponse = {
  success: boolean;
  data: TIngredient[];
};

type IngredientsState = {
  ingredients: TIngredientWithCounter[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
};

const initialState: IngredientsState = {
  ingredients: [],
  isLoading: false,
  hasError: false,
  errorMessage: undefined,
};

const ingredientsURL = `${baseURL}/ingredients`;

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(ingredientsURL);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const rawData: unknown = await response.json();
      if (
        rawData &&
        typeof rawData === 'object' &&
        'success' in rawData &&
        typeof rawData.success === 'boolean' &&
        'data' in rawData &&
        Array.isArray(rawData.data)
      ) {
        const data: ApiResponse = rawData as ApiResponse;
        if (!data.success) {
          throw new Error('API request failed');
        }
        return data.data;
      } else {
        throw new Error('Invalid API response structure');
      }
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : 'Unknown error');
    }
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    incrementCounter: (state, action: PayloadAction<string>) => {
      console.log('incrementCounter ', action.payload);
      return {
        ...state,
        ingredients: state.ingredients.map((ing) =>
          ing._id === action.payload ? { ...ing, count: ing.count + 1 } : ing
        ),
      };
    },
    decrementCounter: (state, action: PayloadAction<string>) => {
      console.log('decrementCounter ', action.payload);
      return {
        ...state,
        ingredients: state.ingredients.map((ing) =>
          ing._id === action.payload
            ? { ...ing, count: ing.count - 1 >= 0 ? ing.count - 1 : 0 }
            : ing
        ),
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = undefined;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload.map((ing) => ({ ...ing, count: 0 }));
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.errorMessage = action.payload as string;
      });
  },
});

export const { incrementCounter, decrementCounter } = ingredientsSlice.actions;

export default ingredientsSlice.reducer;

export const selectIngredients = (state: {
  ingredients: IngredientsState;
}): TIngredientWithCounter[] => state.ingredients.ingredients;
export const selectIsLoading = (state: { ingredients: IngredientsState }): boolean =>
  state.ingredients.isLoading;
export const selectErrorMessage = (state: {
  ingredients: IngredientsState;
}): string | undefined => state.ingredients.errorMessage;
export const selectError = (state: { ingredients: IngredientsState }): boolean =>
  state.ingredients.hasError;
