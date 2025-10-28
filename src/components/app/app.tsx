import { FeedPage } from '@/pages/feed-page';
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
import { useAppDispatch } from '@/utils/hooks';
import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { OrderInfo } from '../oder-info';
import { AppHeader } from '@components/app-header/app-header';
import { IngredientDetails } from '@components/burger-ingredients/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { ProtectedRouteElement } from '@components/protecetd-route';
import { RestrictedRouteElement } from '@components/restricted-route';

import styles from './app.module.css';

type LocationState = {
  background?: Location;
};

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
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
          <Route path="orders/:id" element={<OrderInfo />} />
        </Route>
        <Route path="/feed" element={<FeedPage />} />
        <Route path="feed/:id" element={<OrderInfo />} />
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
          <Route
            path={'/profile/orders/:id'}
            element={
              <Modal onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />

          <Route
            path={'feed/:id'}
            element={
              <Modal onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
