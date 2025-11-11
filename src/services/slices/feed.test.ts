import { validateOrders } from '@/utils/responseValidators';
import { vi } from 'vitest';

import { feedWsActions } from '../actions/feed-ws';
import reducer from './feed';

import type { FeedState, TOrderItem } from '@/utils/types';

describe('feed slice', () => {
  const mockOrders: TOrderItem[] = [
    {
      _id: 'ord1',
      ingredients: ['ing1', 'ing2'],
      status: 'done',
      name: 'Cosmic Burger',
      createdAt: '2025-11-10T09:00:00Z',
      updatedAt: '2025-11-10T09:05:00Z',
      number: 1001,
    },
    {
      _id: 'ord2',
      ingredients: ['ing3'],
      status: 'pending',
      name: 'Meteor Sauce',
      createdAt: '2025-11-10T09:05:00Z',
      updatedAt: '2025-11-10T09:05:00Z',
      number: 1002,
    },
  ];

  const initialState: FeedState = {
    orders: [],
    total: 0,
    totalToday: 0,
    isConnected: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('WebSocket connection', () => {
    it('should set isConnected true and clear error on wsOpen', () => {
      const action = { type: feedWsActions.onOpen };
      const state = reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isConnected: true,
        error: null,
      });
    });

    it('should set isConnected true and clear error on wsSuccess', () => {
      const action = { type: feedWsActions.onSuccess };
      const state = reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isConnected: true,
        error: null,
      });
    });

    it('should set isConnected false on wsClosed', () => {
      const connectedState: FeedState = {
        ...initialState,
        isConnected: true,
      };
      const action = { type: feedWsActions.onClosed };
      const state = reducer(connectedState, action);
      expect(state.isConnected).toBe(false);
    });
  });

  describe('wsError', () => {
    it('should set error and isConnected false', () => {
      const action = {
        type: feedWsActions.onError,
        payload: 'Connection timeout',
      };
      const state = reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        error: 'Connection timeout',
        isConnected: false,
      });
    });
  });

  describe('wsMessage', () => {
    it('should update orders, total, totalToday from payload', () => {
      const payload = { orders: mockOrders, total: 5000, totalToday: 150 };
      const action = { type: feedWsActions.onMessage, payload };

      vi.spyOn({ validateOrders }, 'validateOrders').mockReturnValue(mockOrders);

      const state = reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        orders: mockOrders,
        total: 5000,
        totalToday: 150,
      });
    });

    it('should preserve current total if payload.total is missing', () => {
      const currentState: FeedState = {
        ...initialState,
        total: 100,
        totalToday: 20,
      };
      const payload = {
        orders: mockOrders,
        totalToday: 25,
      };
      const action = {
        type: feedWsActions.onMessage,
        payload,
      };

      vi.spyOn({ validateOrders }, 'validateOrders').mockReturnValue(mockOrders);

      const state = reducer(currentState, action);
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(25);
    });

    it('should handle empty orders array', () => {
      const payload = {
        orders: [],
        total: 0,
        totalToday: 0,
      };
      const action = {
        type: feedWsActions.onMessage,
        payload,
      };

      vi.spyOn({ validateOrders }, 'validateOrders').mockReturnValue([]);

      const state = reducer(initialState, action);
      expect(state.orders).toEqual([]);
    });
  });
});
