import { fetchUser, refreshToken } from '@/services/actions/user';
import { selectIsAuthenticated, selectIsUserLoading } from '@/services/slices/user';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import type { AppDispatch } from '@services/index';

export function ProtectedRouteElement({
  element,
}: {
  element: React.JSX.Element;
}): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsUserLoading);
  const [isUserLoaded, setUserLoaded] = useState(false);

  const init = async (): Promise<void> => {
    try {
      await dispatch(fetchUser()).unwrap();
    } catch (error: unknown) {
      const errorMessage = typeof error === 'string' ? error : 'Unknown error';
      if (
        errorMessage === 'No access token available' ||
        errorMessage === 'Failed to fetch user data'
      ) {
        try {
          await dispatch(refreshToken()).unwrap();
          await dispatch(fetchUser()).unwrap();
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
        }
      } else {
        console.error('Unexpected error:', errorMessage);
      }
    } finally {
      setUserLoaded(true);
    }
  };

  useEffect(() => {
    void init();
  }, [dispatch]);

  if (!isUserLoaded || isLoading) {
    return <Preloader />;
  }

  return isAuthenticated ? (
    element
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
