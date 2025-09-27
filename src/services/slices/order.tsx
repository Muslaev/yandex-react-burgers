import { createSlice } from '@reduxjs/toolkit';

import { createOrder } from '../actions/order';

import type { OrderState } from '@/utils/types';

const initialState: OrderState = {
  orderNumber: null,
  isLoading: false,
  hasError: false,
  errorMessage: undefined,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.orderNumber = null;
      state.hasError = false;
      state.errorMessage = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = undefined;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderNumber = action.payload.order.number;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.errorMessage = action.payload;
      });
  },
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;

export const selectOrderNumber = (state: { order: OrderState }): number | null =>
  state.order.orderNumber;
export const selectIsOrderLoading = (state: { order: OrderState }): boolean =>
  state.order.isLoading;
export const selectOrderError = (state: { order: OrderState }): string | undefined =>
  state.order.errorMessage;
