import { request } from '@/utils/urls';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { isPartialIngredientsResponse } from '@utils/responseValidators';

import type { TIngredientsResponse } from '@utils/types';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const rawData: unknown = await request('/ingredients');
      if (isPartialIngredientsResponse(rawData)) {
        const data = rawData as TIngredientsResponse;
        if (!data.success) {
          throw new Error('Ingredients request failed');
        }
        return data.data;
      } else {
        throw new Error('Invalid API response structure');
      }
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : 'Unknown error');
    }
  }
);
