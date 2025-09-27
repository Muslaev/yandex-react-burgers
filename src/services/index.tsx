import { configureStore } from '@reduxjs/toolkit';

import constructorReducer from './slices/burger-constructor';
import ingredientsReducer from './slices/ingredients';
import orderReducer from './slices/order';
import userReducer from './slices/user';

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    burgerConstructor: constructorReducer,
    order: orderReducer,
    user: userReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
