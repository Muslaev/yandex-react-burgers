import { request } from '@/utils/urls';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils/types';

export type TIngredientWithCounter = TIngredient & { count: number };

type TIngredientsResponse = {
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

type PartialIngredientsResponse = Partial<TIngredientsResponse>;

const isPartialIngredientsResponse = (
  rawData: unknown
): rawData is PartialIngredientsResponse => {
  if (!rawData || typeof rawData !== 'object') return false;
  const obj = rawData as Record<string, unknown>;

  if ('success' in obj && typeof obj.success !== 'boolean') return false;
  if ('data' in obj && !Array.isArray(obj.data)) return false;

  return true;
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const rawData: unknown = await request('/ingredients');
      if (isPartialIngredientsResponse(rawData)) {
        const data = rawData as TIngredientsResponse;
        if (!data.success) {
          throw new Error('Ingredients request failed');
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
      return {
        ...state,
        ingredients: state.ingredients.map((ing) =>
          ing._id === action.payload ? { ...ing, count: ing.count + 1 } : ing
        ),
      };
    },
    decrementCounter: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        ingredients: state.ingredients.map((ing) =>
          ing._id === action.payload
            ? { ...ing, count: ing.count - 1 >= 0 ? ing.count - 1 : 0 }
            : ing
        ),
      };
    },
    clearCounters: (state) => {
      return {
        ...state,
        ingredients: state.ingredients.map((ing) => ({ ...ing, count: 0 })),
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

export const { incrementCounter, decrementCounter, clearCounters } =
  ingredientsSlice.actions;

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
