import { selectIsAuthenticated } from '@/services/slices/user';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { TWsActions } from '@/services/middleware/socketMiddleware';
import type { AppDispatch, RootState } from '@services/index';
import type { TypedUseSelectorHook } from 'react-redux';

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useWsConnection = (wsActions: TWsActions, requireAuth = false): void => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    const shouldConnect = !requireAuth || isAuthenticated;
    if (shouldConnect) {
      dispatch({ type: wsActions.onStart });
    }

    const cleanup: () => void = () => {
      if (shouldConnect) {
        dispatch({ type: wsActions.onDisconnect });
      }
    };

    return cleanup;
  }, [dispatch, isAuthenticated, requireAuth, wsActions]);
};
