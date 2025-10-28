// src/services/actions/order-details.ts
import { createAsyncThunk } from '@reduxjs/toolkit';

import type { RootState } from '../index';
import type { TOrderItem } from '@/utils/types';

/* -------------------------------------------------
   1. Ожидаемый ответ
   ------------------------------------------------- */
type TOrderResponse = {
  success: true;
  orders: TOrderItem[];
};

/* -------------------------------------------------
   2. Вспомогательные type-guard'ы
   ------------------------------------------------- */
const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const isString = (v: unknown): v is string => typeof v === 'string';
const isNumber = (v: unknown): v is number => typeof v === 'number';
const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every(isString);

/* -------------------------------------------------
   3. Основной type-guard
   ------------------------------------------------- */
const isValidOrderResponse = (data: unknown): data is TOrderResponse => {
  // 1. data — объект
  if (!isObject(data)) return false;

  // 2. success === true
  if (!('success' in data) || data.success !== true) return false;

  // 3. orders — массив
  if (!('orders' in data) || !Array.isArray(data.orders)) return false;

  // 4. orders не пустой
  if (data.orders.length === 0) return false;

  // 5. Проверяем первый заказ
  const firstOrder = data.orders[0] as TOrderItem;
  if (!isObject(firstOrder)) return false;

  return (
    '_id' in firstOrder &&
    isString(firstOrder._id) &&
    'ingredients' in firstOrder &&
    isStringArray(firstOrder.ingredients) &&
    'status' in firstOrder &&
    isString(firstOrder.status) &&
    'name' in firstOrder &&
    isString(firstOrder.name) &&
    'number' in firstOrder &&
    isNumber(firstOrder.number) &&
    'createdAt' in firstOrder &&
    isString(firstOrder.createdAt)
  );
};

/* -------------------------------------------------
   4. Thunk — 100% типобезопасно
   ------------------------------------------------- */
export const fetchOrderByNumber = createAsyncThunk<
  TOrderItem,
  number,
  { state: RootState; rejectValue: string }
>('orderDetails/fetchByNumber', async (orderNumber, { getState, rejectWithValue }) => {
  try {
    const { accessToken } = getState().user;
    if (!accessToken) return rejectWithValue('No access token');

    const response = await fetch(
      `https://norma.education-services.ru/api/orders/${orderNumber}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      const txt = await response.text();
      throw new Error(`HTTP ${response.status}: ${txt}`);
    }

    const data: unknown = await response.json();

    if (!isValidOrderResponse(data)) {
      return rejectWithValue('Invalid response format');
    }

    // ← TypeScript: data: TOrderResponse
    // ← data.orders[0]: TOrderItem
    return data.orders[0];
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return rejectWithValue(msg);
  }
});
