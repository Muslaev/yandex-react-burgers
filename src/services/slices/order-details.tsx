// src/services/slices/order-details.tsx
import { createSlice } from '@reduxjs/toolkit';

import { fetchOrderByNumber } from '../actions/order-details';

import type { TOrderItem } from '@/utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';

type OrderDetailsState = {
  order: TOrderItem | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: OrderDetailsState = {
  order: null,
  isLoading: false,
  error: null,
};

const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.error = null;
      state.isLoading = false; // добавим сброс
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.order = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrderItem>) => {
          state.isLoading = false;
          state.order = action.payload;
        }
      )
      .addCase(
        fetchOrderByNumber.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.error = action.payload ?? 'Failed to load order';
        }
      );
  },
});

export const { clearOrder } = orderDetailsSlice.actions;
export default orderDetailsSlice.reducer;

// Селекторы
export const selectOrderDetails = (state: {
  orderDetails: OrderDetailsState;
}): TOrderItem | null => state.orderDetails.order;

export const selectOrderDetailsLoading = (state: {
  orderDetails: OrderDetailsState;
}): boolean => state.orderDetails.isLoading;

export const selectOrderDetailsError = (state: {
  orderDetails: OrderDetailsState;
}): string | null => state.orderDetails.error;
