import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient, IngredientDetailsState } from '@utils/types';

const initialState: IngredientDetailsState = {
  ingredient: null,
};

const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState,
  reducers: {
    setIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.ingredient = { ...action.payload };
    },
    removeIngredient: (state) => {
      state.ingredient = null;
    },
  },
});

export const { setIngredient, removeIngredient } = ingredientDetailsSlice.actions;

export default ingredientDetailsSlice.reducer;

export const selectIngredient = (state: {
  ingredientDetails: IngredientDetailsState;
}): TIngredient | null => state.ingredientDetails.ingredient;
