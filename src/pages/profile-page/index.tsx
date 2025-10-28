import { logoutUser } from '@/services/actions/user';
import { selectIsUserLoading } from '@/services/slices/user';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';

import type React from 'react';

import styles from './profile-page.module.css';

export const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectIsUserLoading);
  const location = useLocation();

  const onLogout = async (): Promise<void> => {
    try {
      await dispatch(logoutUser()).unwrap();
      void navigate('/login', { replace: true });
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  const getSubtitle = (): string => {
    if (location.pathname === '/profile') {
      return 'В этом разделе вы можете изменить свои персональные данные';
    } else if (location.pathname === '/profile/orders') {
      return 'В этом разделе вы можете посмотреть свою историю заказов';
    }
    return '';
  };

  return (
    <section className={`${styles.pageWrapper} mt-20`}>
      <nav className={`${styles.nav} mr-15`}>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `text text_type_main-medium ${isActive ? `${styles.active}` : 'text_color_inactive'} ${styles.nav_link}`
          }
          end
        >
          Профиль
        </NavLink>
        <NavLink
          to="/profile/orders"
          className={({ isActive }) =>
            `text text_type_main-medium ${isActive ? `${styles.active}` : 'text_color_inactive'} ${styles.nav_link}`
          }
        >
          История заказов
        </NavLink>
        <button
          className={`text text_type_main-medium text_color_inactive ${styles.nav_link}`}
          onClick={() => void onLogout()}
          disabled={isLoading}
        >
          Выход
        </button>
        <div className={`${styles.subtitle} pt-20`}>
          <p className="text text_type_main-default text_color_inactive">
            {getSubtitle()}
          </p>
        </div>
      </nav>

      <div className={styles.formContainer}>
        <Outlet />
      </div>
    </section>
  );
};

export default ProfilePage;
