// src/services/middleware/socketMiddleware.ts
import { refreshToken } from '../actions/user';

import type { AppDispatch, RootState } from '../index';
import type { Middleware, MiddlewareAPI } from 'redux';

export type TWsActions = {
  onStart: string;
  onSuccess: string;
  onOpen: string;
  onClose: string;
  onClosed: string;
  onError: string;
  onMessage: string;
  onDisconnect: string;
};

type TWsMessage = {
  orders?: {
    _id: string;
    ingredients: string[];
    status: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    number: number;
  }[];
  total?: number;
  totalToday?: number;
  message?: string;
};

// Type guard для action
const isWsStartAction = (
  action: unknown
): action is { type: string; payload?: { url?: string } } => {
  return (
    typeof action === 'object' &&
    action !== null &&
    'type' in action &&
    typeof (action as Record<string, unknown>).type === 'string'
  );
};

export const socketMiddleware = (
  wsUrl: string,
  wsActions: TWsActions,
  requireAuth = false
): Middleware => {
  return (store: MiddlewareAPI<AppDispatch, RootState>) => {
    let socket: WebSocket | null = null;
    let reconnectTimer = 0;
    let isConnected = false;
    let currentUrl = '';

    const { dispatch } = store;

    const connect = (url: string): void => {
      socket = new WebSocket(url);
      isConnected = true;

      socket.onopen = (): void => {
        dispatch({ type: wsActions.onOpen });
      };

      socket.onmessage = (event: MessageEvent): void => {
        try {
          const data: unknown = JSON.parse(event.data as string);

          if (
            typeof data === 'object' &&
            data !== null &&
            'message' in data &&
            (data as { message: unknown }).message === 'Invalid or missing token' &&
            requireAuth
          ) {
            handleTokenRefresh();
            return;
          }

          dispatch({ type: wsActions.onMessage, payload: data as TWsMessage });
        } catch {
          dispatch({ type: wsActions.onError, payload: 'Parse error' });
        }
      };

      socket.onerror = (): void => {
        dispatch({ type: wsActions.onError, payload: 'WebSocket error' });
      };

      socket.onclose = (event: CloseEvent): void => {
        dispatch({ type: wsActions.onClosed });

        if (event.code !== 1000) {
          scheduleReconnect();
        }
      };
    };

    const handleTokenRefresh = (): void => {
      socket?.close();
      dispatch(refreshToken())
        .unwrap()
        .then(() => {
          const token = store.getState().user.accessToken;
          if (token) {
            connect(`${wsUrl}?token=${token}`);
          }
        })
        .catch(() => {
          dispatch({ type: wsActions.onError, payload: 'Token refresh failed' });
        });
    };

    const scheduleReconnect = (): void => {
      if (reconnectTimer) return;
      reconnectTimer = window.setTimeout(() => {
        reconnectTimer = 0;
        if (isConnected) {
          const token = requireAuth ? store.getState().user.accessToken : null;
          const url = token ? `${wsUrl}?token=${token}` : wsUrl;
          connect(url);
        }
      }, 3000);
    };

    return (next) => (action: unknown) => {
      // === Проверяем тип action ===
      if (!isWsStartAction(action)) {
        return next(action);
      }

      const { type } = action;

      if (type === wsActions.onStart) {
        currentUrl = action.payload?.url ?? wsUrl;
        const token = requireAuth ? store.getState().user.accessToken : null;
        const url = token ? `${currentUrl}?token=${token}` : currentUrl;

        if (socket) socket.close();
        connect(url);
        dispatch({ type: wsActions.onSuccess });
        return;
      }

      if (type === wsActions.onDisconnect && socket) {
        window.clearTimeout(reconnectTimer);
        reconnectTimer = 0;
        isConnected = false;
        socket.close();
        socket = null;
        dispatch({ type: wsActions.onClosed });
      }

      return next(action);
    };
  };
};
