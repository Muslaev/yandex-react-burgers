import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils/types';

type IIngredientDetailsState = {
  ingredient: TIngredient | null;
};

const initialState: IIngredientDetailsState = {
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
  ingredientDetails: IIngredientDetailsState;
}): TIngredient | null => state.ingredientDetails.ingredient;
