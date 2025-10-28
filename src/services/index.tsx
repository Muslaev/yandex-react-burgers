import { baseSocketURL } from '@/utils/urls';
import { configureStore } from '@reduxjs/toolkit';

import { feedWsActions } from './actions/feed-ws';
import { userFeedWsActions } from './actions/user-feed-ws';
import { socketMiddleware } from './middleware/socketMiddleware';
import constructorReducer from './slices/burger-constructor';
import feedReducer from './slices/feed';
import ingredientsReducer from './slices/ingredients';
import orderReducer from './slices/order';
import orderDetailsReducer from './slices/order-details';
import userReducer from './slices/user';
import userFeedReducer from './slices/user-feed';

const feedMiddleware = socketMiddleware(`${baseSocketURL}/all`, feedWsActions);
const userFeedMiddleware = socketMiddleware(baseSocketURL, userFeedWsActions, true);

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    burgerConstructor: constructorReducer,
    order: orderReducer,
    user: userReducer,
    feed: feedReducer,
    userFeed: userFeedReducer,
    orderDetails: orderDetailsReducer,
  },
  middleware: (getDefault) => getDefault().concat(feedMiddleware, userFeedMiddleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
