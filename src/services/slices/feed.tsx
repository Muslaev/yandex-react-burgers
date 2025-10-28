import { validateOrders } from '@/utils/responseValidators';
import { createSlice } from '@reduxjs/toolkit';

import type { FeedState } from '@/utils/types';
// src/services/slices/feed.tsx
import type { PayloadAction } from '@reduxjs/toolkit';

// === Типы WS ===
type TWsMessagePayload = {
  orders?: {
    _id: string;
    ingredients: string[];
    status: string;
    name: string;
    number: number;
    createdAt: string;
    updatedAt?: string;
  }[];
  total?: number;
  totalToday?: number;
};

// === Type guards для matcher ===
const isWsOpenOrSuccess = (
  action: unknown
): action is { type: 'feed/wsOpen' | 'feed/wsSuccess' } =>
  typeof action === 'object' &&
  action !== null &&
  'type' in action &&
  (action.type === 'feed/wsOpen' || action.type === 'feed/wsSuccess');

const isWsClosed = (action: unknown): action is { type: 'feed/wsClosed' } =>
  typeof action === 'object' &&
  action !== null &&
  'type' in action &&
  action.type === 'feed/wsClosed';

const isWsError = (action: unknown): action is PayloadAction<string> =>
  typeof action === 'object' &&
  action !== null &&
  'type' in action &&
  action.type === 'feed/wsError' &&
  'payload' in action &&
  typeof action.payload === 'string';

const isWsMessage = (action: unknown): action is PayloadAction<TWsMessagePayload> =>
  typeof action === 'object' &&
  action !== null &&
  'type' in action &&
  action.type === 'feed/wsMessage' &&
  'payload' in action &&
  typeof action.payload === 'object' &&
  action.payload !== null;

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isConnected: false,
  error: null,
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Успешное подключение
      .addMatcher(isWsOpenOrSuccess, (state) => {
        state.isConnected = true;
        state.error = null;
      })
      // Закрытие
      .addMatcher(isWsClosed, (state) => {
        state.isConnected = false;
      })
      // Ошибка
      .addMatcher(isWsError, (state, action) => {
        state.error = action.payload;
        state.isConnected = false;
      })
      // Новое сообщение
      .addMatcher(isWsMessage, (state, action) => {
        const payload = action.payload;

        if (payload && typeof payload === 'object') {
          const orders = Array.isArray(payload.orders) ? payload.orders : [];
          state.orders = validateOrders(orders);

          state.total = typeof payload.total === 'number' ? payload.total : state.total;
          state.totalToday =
            typeof payload.totalToday === 'number'
              ? payload.totalToday
              : state.totalToday;
        }
      });
  },
});

export default feedSlice.reducer;

// === Селекторы ===
export const selectFeedOrders = (state: { feed: FeedState }): FeedState['orders'] =>
  state.feed.orders;

export const selectFeedTotal = (state: { feed: FeedState }): FeedState['total'] =>
  state.feed.total;

export const selectFeedTotalToday = (state: {
  feed: FeedState;
}): FeedState['totalToday'] => state.feed.totalToday;

export const selectFeedIsConnected = (state: {
  feed: FeedState;
}): FeedState['isConnected'] => state.feed.isConnected;

export const selectFeedError = (state: { feed: FeedState }): FeedState['error'] =>
  state.feed.error;
