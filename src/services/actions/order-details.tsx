import { request } from '@/utils/urls';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { isPartialOrderDetailsResponse } from '@utils/responseValidators';

import type { RootState } from '../index';
import type { TOrderItem, TOrderDetailsResponse } from '@/utils/types';

export const fetchOrderByNumber = createAsyncThunk<
  TOrderItem,
  number,
  { state: RootState; rejectValue: string }
>('orderDetails/fetchByNumber', async (orderNumber, { getState, rejectWithValue }) => {
  try {
    const { accessToken } = getState().user;
    if (!accessToken) {
      return rejectWithValue('No access token');
    }

    const rawData: unknown = await request(`/orders/${orderNumber}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!isPartialOrderDetailsResponse(rawData)) {
      throw new Error('Invalid API response structure');
    }

    const data = rawData as TOrderDetailsResponse;

    if (!data.success || !data.data || data.data.length === 0) {
      throw new Error('Order not found or request failed');
    }

    return data.data[0];
  } catch (e) {
    return rejectWithValue(e instanceof Error ? e.message : 'Unknown error');
  }
});
