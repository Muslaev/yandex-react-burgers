import { ForgotPasswordPage } from '@/pages/forgot-password-page';
import { HomePage } from '@/pages/home-page';
import { IngredientPage } from '@/pages/ingredients-page';
import { LoginPage } from '@/pages/login-page';
import { NotFoundPage } from '@/pages/not-found-page';
import { ProfilePage } from '@/pages/profile-page';
import { OrderHistory } from '@/pages/profile-page/order-history';
import { ProfileSettings } from '@/pages/profile-page/profile-settings';
import { RegisterPage } from '@/pages/register-page';
import { ResetPasswordPage } from '@/pages/reset-password-page';
import { fetchIngredients } from '@/services/actions/ingredients';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { IngredientDetails } from '@components/burger-ingredients/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { ProtectedRouteElement } from '@components/protecetd-route';
import { RestrictedRouteElement } from '@components/restricted-route';

import type { AppDispatch } from '@/services';

import styles from './app.module.css';

type LocationState = {
  background?: Location;
};

export const App = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  const background = state?.background ?? null;

  const handleCloseModal = (): void => {
    void navigate(-1);
  };

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background ?? location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/ingredients/:id" element={<IngredientPage />} />
        <Route
          path="/login"
          element={<RestrictedRouteElement element={<LoginPage />} />}
        />
        <Route
          path="/register"
          element={<RestrictedRouteElement element={<RegisterPage />} />}
        />
        <Route
          path="/forgot-password"
          element={<RestrictedRouteElement element={<ForgotPasswordPage />} />}
        />
        <Route
          path="/reset-password"
          element={
            <RestrictedRouteElement
              element={<ResetPasswordPage />}
              restrictToResetPassword={true}
            />
          }
        />
        <Route
          path="/profile"
          element={<ProtectedRouteElement element={<ProfilePage />} />}
        >
          <Route index element={<ProfileSettings />} />
          <Route path="orders" element={<OrderHistory />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal onClose={handleCloseModal} header="Детали ингредиента">
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
