import { userFeedWsActions } from '../actions/user-feed-ws';
import reducer from './user-feed';

import type { UserFeedState, TOrderItem } from '@/utils/types';

vi.mock('@/utils/responseValidators', () => ({
  validateOrders: vi.fn(),
}));

import { validateOrders } from '@/utils/responseValidators';
import { vi } from 'vitest';

describe('userFeed slice', () => {
  const mockOrders: TOrderItem[] = [
    {
      _id: 'user1',
      ingredients: ['ing1', 'bun1'],
      status: 'done',
      name: 'My Cosmic Burger',
      createdAt: '2025-11-10T08:00:00Z',
      updatedAt: '2025-11-10T09:05:00Z',
      number: 5001,
    },
  ];

  const initialState: UserFeedState = {
    orders: [],
    isConnected: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('WebSocket connection', () => {
    it('should set isConnected true and clear error on wsOpen', () => {
      const action = { type: userFeedWsActions.onOpen };
      const state = reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isConnected: true,
        error: null,
      });
    });

    it('should set isConnected true and clear error on wsSuccess', () => {
      const action = { type: userFeedWsActions.onSuccess };
      const state = reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isConnected: true,
        error: null,
      });
    });

    it('should set isConnected false on wsClosed', () => {
      const connectedState: UserFeedState = {
        ...initialState,
        isConnected: true,
      };
      const action = { type: userFeedWsActions.onClosed };
      const state = reducer(connectedState, action);
      expect(state.isConnected).toBe(false);
    });
  });

  describe('wsError', () => {
    it('should set error and isConnected false', () => {
      const action = {
        type: userFeedWsActions.onError,
        payload: 'Authentication failed',
      };
      const state = reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        error: 'Authentication failed',
        isConnected: false,
      });
    });
  });

  describe('wsMessage', () => {
    it('should update orders from payload using validateOrders', () => {
      const payload = { orders: mockOrders };
      const action = { type: userFeedWsActions.onMessage, payload };

      vi.mocked(validateOrders).mockReturnValue(mockOrders);

      const state = reducer(initialState, action);
      expect(state.orders).toEqual(mockOrders);
      expect(validateOrders).toHaveBeenCalledWith(mockOrders);
    });

    it('should handle empty or missing orders', () => {
      const payload = { orders: [] };
      const action = { type: userFeedWsActions.onMessage, payload };

      vi.mocked(validateOrders).mockReturnValue([]);

      const state = reducer(initialState, action);
      expect(state.orders).toEqual([]);
      expect(validateOrders).toHaveBeenCalledWith([]);
    });

    it('should handle payload without orders', () => {
      const payload = {};
      const action = { type: userFeedWsActions.onMessage, payload };

      vi.mocked(validateOrders).mockReturnValue([]);

      const state = reducer(initialState, action);
      expect(state.orders).toEqual([]);
      expect(validateOrders).toHaveBeenCalledWith([]);
    });
  });
});
