import {
  selectIsAuthenticated,
  selectPasswordResetRequested,
} from '@/services/slices/user';
import { useAppSelector } from '@/utils/hooks';
import { Navigate, useLocation } from 'react-router-dom';

// Определяем интерфейс для state, чтобы TypeScript знал его структуру
type LocationState = {
  from?: {
    pathname: string;
  };
};

export function RestrictedRouteElement({
  element,
  restrictToResetPassword = false,
}: {
  element: React.JSX.Element;
  restrictToResetPassword?: boolean;
}): React.JSX.Element {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const passwordResetRequested = useAppSelector(selectPasswordResetRequested);
  const location = useLocation();
  const state = location.state as LocationState | null;

  if (restrictToResetPassword && !passwordResetRequested && !isAuthenticated) {
    return <Navigate to="/forgot-password" replace />;
  }

  if (isAuthenticated) {
    const redirectTo = state?.from?.pathname ?? '/';
    return <Navigate to={redirectTo} replace />;
  }

  return element;
}
