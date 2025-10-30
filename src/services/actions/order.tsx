import { isPartialOrderResponse } from '@/utils/responseValidators';
import { request } from '@/utils/urls';
import { createAsyncThunk } from '@reduxjs/toolkit';

import type { RootState } from '../index';
import type { TOrderResponse } from '@/utils/types';

export const createOrder = createAsyncThunk<
  TOrderResponse,
  string[],
  { state: RootState; rejectValue: string }
>('order/createOrder', async (ingredientIds, { getState, rejectWithValue }) => {
  try {
    const { accessToken } = getState().user;
    if (!accessToken) {
      return rejectWithValue('No access token');
    }
    const rawData: unknown = await request('/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ ingredients: ingredientIds }),
    });

    if (isPartialOrderResponse(rawData)) {
      const data = rawData as TOrderResponse;

      if (!data.success) {
        throw new Error('Order creation failed');
      }

      return data;
    } else {
      throw new Error('Invalid API response structure');
    }
  } catch (e) {
    return rejectWithValue(e instanceof Error ? e.message : 'Unknown error');
  }
});
