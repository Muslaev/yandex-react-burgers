import { createOrder } from '../actions/order';
import reducer, { resetOrder } from './order';

import type { OrderState } from '@/utils/types';

describe('order slice', () => {
  const initialState: OrderState = {
    orderNumber: null,
    isLoading: false,
    hasError: false,
    errorMessage: undefined,
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('createOrder', () => {
    it('should set isLoading true on pending', () => {
      const action = { type: createOrder.pending.type };
      const state = reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: true,
        hasError: false,
        errorMessage: undefined,
      });
    });

    it('should set orderNumber on fulfilled', () => {
      const payload = {
        success: true,
        name: 'Space Burger',
        order: { number: 12345 },
      };
      const action = { type: createOrder.fulfilled.type, payload };
      const state = reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        orderNumber: 12345,
      });
    });

    it('should set error on rejected', () => {
      const errorMessage = 'No access token';
      const action = {
        type: createOrder.rejected.type,
        payload: errorMessage,
      };
      const state = reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        hasError: true,
        errorMessage,
      });
    });
  });

  describe('resetOrder', () => {
    const stateWithOrder: OrderState = {
      orderNumber: 12345,
      isLoading: false,
      hasError: true,
      errorMessage: 'Failed',
    };

    it('should reset order to initial state', () => {
      const state = reducer(stateWithOrder, resetOrder());
      expect(state).toEqual(initialState);
    });
  });
});
