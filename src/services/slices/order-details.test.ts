import { fetchOrderByNumber } from '../actions/order-details';
import reducer, { clearOrder } from './order-details';

import type { TOrderItem } from '@/utils/types';

describe('orderDetails slice', () => {
  const mockOrder: TOrderItem = {
    _id: 'order123',
    ingredients: ['ing1', 'ing2'],
    status: 'done',
    name: 'Space Burger',
    createdAt: '2025-11-10T10:00:00Z',
    updatedAt: '2025-11-10T10:05:00Z',
    number: 12345,
  };

  const initialState = {
    order: null,
    isLoading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('fetchOrderByNumber', () => {
    it('should set isLoading true and clear previous data on pending', () => {
      const action = { type: fetchOrderByNumber.pending.type };
      const state = reducer(initialState, action);
      expect(state).toEqual({
        order: null,
        isLoading: true,
        error: null,
      });
    });

    it('should set order on fulfilled', () => {
      const action = {
        type: fetchOrderByNumber.fulfilled.type,
        payload: mockOrder,
      };
      const state = reducer(initialState, action);
      expect(state).toEqual({
        order: mockOrder,
        isLoading: false,
        error: null,
      });
    });

    it('should set error on rejected', () => {
      const errorMessage = 'Order not found or request failed';
      const action = {
        type: fetchOrderByNumber.rejected.type,
        payload: errorMessage,
      };
      const state = reducer(initialState, action);
      expect(state).toEqual({
        order: null,
        isLoading: false,
        error: errorMessage,
      });
    });

    it('should use default error message if payload is undefined', () => {
      const action = {
        type: fetchOrderByNumber.rejected.type,
        payload: undefined,
      };
      const state = reducer(initialState, action);
      expect(state.error).toBe('Failed to load order');
    });
  });

  describe('clearOrder', () => {
    const stateWithOrder = {
      order: mockOrder,
      isLoading: false,
      error: 'Some error',
    };

    it('should clear order and error', () => {
      const state = reducer(stateWithOrder, clearOrder());
      expect(state).toEqual({
        order: null,
        isLoading: false,
        error: null,
      });
    });
  });
});
