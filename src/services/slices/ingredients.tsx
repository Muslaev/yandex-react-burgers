import { createSlice } from '@reduxjs/toolkit';

import { fetchIngredients } from '../actions/ingredients';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredientWithCounter, IngredientsState } from '@utils/types';

const initialState: IngredientsState = {
  ingredients: [],
  isLoading: false,
  hasError: false,
  errorMessage: undefined,
};

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
