import { isPartialOrderResponse } from '@/utils/responseValidators';
import { request } from '@/utils/urls';
import { createAsyncThunk } from '@reduxjs/toolkit';

import type { TOrderResponse } from '@/utils/types';

export const createOrder = createAsyncThunk<
  TOrderResponse,
  string[],
  { rejectValue: string }
>('order/createOrder', async (ingredientIds, { rejectWithValue }) => {
  try {
    const rawData: unknown = await request('/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
