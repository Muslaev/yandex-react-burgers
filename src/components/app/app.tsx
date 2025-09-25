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
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { ProtectedRouteElement } from '@components/protecetd-route';
import { RestrictedRouteElement } from '@components/restricted-route';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  return (
    <div className={styles.app}>
      <Router>
        <AppHeader />
        <Routes>
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
      </Router>
    </div>
  );
};

export default App;
