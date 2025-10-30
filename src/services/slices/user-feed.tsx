import { validateOrders } from '@/utils/responseValidators';
import { createSlice } from '@reduxjs/toolkit';

import type { UserFeedState } from '@/utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';

type TWsUserFeedPayload = {
  orders?: {
    _id: string;
    ingredients: string[];
    status: string;
    name: string;
    number: number;
    createdAt: string;
    updatedAt?: string;
  }[];
};

const isWsOpenOrSuccess = (
  action: unknown
): action is { type: 'userFeed/wsOpen' | 'userFeed/wsSuccess' } =>
  typeof action === 'object' &&
  action !== null &&
  'type' in action &&
  (action.type === 'userFeed/wsOpen' || action.type === 'userFeed/wsSuccess');

const isWsClosed = (action: unknown): action is { type: 'userFeed/wsClosed' } =>
  typeof action === 'object' &&
  action !== null &&
  'type' in action &&
  action.type === 'userFeed/wsClosed';

const isWsError = (action: unknown): action is PayloadAction<string> =>
  typeof action === 'object' &&
  action !== null &&
  'type' in action &&
  action.type === 'userFeed/wsError' &&
  'payload' in action &&
  typeof action.payload === 'string';

const isWsMessage = (action: unknown): action is PayloadAction<TWsUserFeedPayload> =>
  typeof action === 'object' &&
  action !== null &&
  'type' in action &&
  action.type === 'userFeed/wsMessage' &&
  'payload' in action &&
  typeof action.payload === 'object' &&
  action.payload !== null;

const initialState: UserFeedState = {
  orders: [],
  isConnected: false,
  error: null,
};

const userFeedSlice = createSlice({
  name: 'userFeed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(isWsOpenOrSuccess, (state) => {
        state.isConnected = true;
        state.error = null;
      })
      .addMatcher(isWsClosed, (state) => {
        state.isConnected = false;
      })
      .addMatcher(isWsError, (state, action) => {
        state.error = action.payload;
        state.isConnected = false;
      })
      .addMatcher(isWsMessage, (state, action) => {
        const payload = action.payload;

        if (payload && typeof payload === 'object') {
          console.log('MESSAGE USER FEED:', payload);
          const orders = Array.isArray(payload.orders) ? payload.orders : [];
          state.orders = validateOrders(orders);
        }
      });
  },
});

export default userFeedSlice.reducer;

export const selectUserFeedOrders = (state: {
  userFeed: UserFeedState;
}): UserFeedState['orders'] => state.userFeed.orders;

export const selectUserFeedIsConnected = (state: {
  userFeed: UserFeedState;
}): UserFeedState['isConnected'] => state.userFeed.isConnected;

export const selectUserFeedError = (state: {
  userFeed: UserFeedState;
}): UserFeedState['error'] => state.userFeed.error;
