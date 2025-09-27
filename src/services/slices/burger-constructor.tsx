import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  TIngredientWithCounter,
  TIngredientWithKey,
  ConstructorState,
} from '@utils/types';

const initialState: ConstructorState = {
  bun: null,
  constructorIngredients: [],
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TIngredientWithKey>) => {
        const payload = { ...action.payload };
        if (payload.type === 'bun') {
          return {
            ...state,
            bun: payload,
          };
        } else {
          if (!state.constructorIngredients) state.constructorIngredients = [];
          state.constructorIngredients.push(payload);
        }
      },
      prepare: (ingredient: TIngredientWithCounter) => {
        const key = uuidv4();
        return { payload: { ...ingredient, key } };
      },
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorIngredients = state.constructorIngredients.filter(
        (item) => item.key !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.constructorIngredients.length ||
        toIndex >= state.constructorIngredients.length
      )
        return;

      const draggedItem = state.constructorIngredients[fromIndex];
      state.constructorIngredients.splice(fromIndex, 1);
      state.constructorIngredients.splice(toIndex, 0, draggedItem);
    },
    clearIngredients: (state) => {
      state.constructorIngredients = initialState.constructorIngredients;
      state.bun = initialState.bun;
    },
  },
  extraReducers: (builder) => {
    builder.addDefaultCase((state) => {
      return state;
    });
  },
});

export const { addIngredient, removeIngredient, moveIngredient, clearIngredients } =
  constructorSlice.actions;

export default constructorSlice.reducer;

export const selectConstructorIngredients = (state: {
  burgerConstructor: ConstructorState;
}): TIngredientWithKey[] => state.burgerConstructor.constructorIngredients;

export const selectConstructorBun = (state: {
  burgerConstructor: ConstructorState;
}): TIngredientWithCounter | null => state.burgerConstructor.bun;
