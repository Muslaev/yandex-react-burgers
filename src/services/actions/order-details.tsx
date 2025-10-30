import { request } from '@/utils/urls';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { isPartialOrderDetailsResponse } from '@utils/responseValidators';

import type { RootState } from '../index';
import type { TOrderItem, TOrderDetailsResponse } from '@/utils/types';

export const fetchOrderByNumber = createAsyncThunk<
  TOrderItem,
  number,
  { state: RootState; rejectValue: string }
>(
  'orderDetails/fetchByNumber',
  async (orderNumber, { /*getState, */ rejectWithValue }) => {
    try {
      const rawData: unknown = await request(`/orders/${orderNumber}`);

      if (!isPartialOrderDetailsResponse(rawData)) {
        throw new Error('Invalid API response structure');
      }

      const data = rawData as TOrderDetailsResponse;
      console.log('data= ', data);

      if (!data.success || !data.orders || data.orders.length === 0) {
        throw new Error('Order not found or request failed');
      }

      return data.orders[0];
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : 'Unknown error');
    }
  }
);
