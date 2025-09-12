import { baseURL } from '@/utils/urls';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

type PartialOrderResponse = Partial<TOrderResponse>;

export type TOrderResponse = {
  name: string;
  order: {
    number: number;
  };
  success: boolean;
};

type OrderState = {
  orderNumber: number | null;
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
};

const initialState: OrderState = {
  orderNumber: null,
  isLoading: false,
  hasError: false,
  errorMessage: undefined,
};

const ordersURL = `${baseURL}/orders`;

const isPartialOrderResponse = (data: unknown): data is PartialOrderResponse => {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;

  if ('success' in obj && typeof obj.success !== 'boolean') return false;
  if ('name' in obj && typeof obj.name !== 'string') return false;

  if ('order' in obj && obj.order && typeof obj.order === 'object') {
    const order = obj.order as Record<string, unknown>;
    if ('number' in order && typeof order.number !== 'number') return false;
  } else {
    return false;
  }

  return true;
};

export const createOrder = createAsyncThunk<
  TOrderResponse,
  string[],
  { rejectValue: string }
>('order/createOrder', async (ingredientIds, { rejectWithValue }) => {
  try {
    const response = await fetch(ordersURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients: ingredientIds }),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const rawData: unknown = await response.json();

    // Валидация структуры ответа
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
