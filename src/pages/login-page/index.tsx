import { loginUser } from '@/services/actions/user';
import {
  selectIsAuthenticated,
  selectIsUserLoading,
  selectUserError,
} from '@/services/slices/user';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import {
  Button,
  EmailInput,
  PasswordInput,
  Preloader,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import styles from './login-page.module.css';

export type LoginForm = {
  email: string;
  password: string;
};

type LocationState = {
  from?: {
    pathname: string;
  };
};

export const LoginPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsUserLoading);
  const error = useAppSelector(selectUserError);

  const onSubmit = async (data: LoginForm): Promise<void> => {
    try {
      await dispatch(loginUser({ email: data.email, password: data.password })).unwrap();
    } catch (err) {
      console.error('Failed to login:', err);
    }
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    void handleSubmit(onSubmit)(e);
  };

  useEffect(() => {
    if (isAuthenticated) {
      const state = location.state as LocationState | null;
      const redirectTo = state?.from?.pathname ?? '/';
      void navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  return (
    <section className={styles.section_form_container}>
      <form className={styles.form_wrapper} onSubmit={onFormSubmit}>
        <h3 className="text text_type_main-medium">Вход</h3>
        <Controller
          name="email"
          control={control}
          rules={{
            required: 'Email обязателен',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Введите корректный email',
            },
          }}
          render={({ field }) => (
            <EmailInput
              placeholder={'Email'}
              isIcon={false}
              value={field.value}
              onChange={field.onChange}
              name={field.name}
              autoComplete="off"
              extraClass="mt-6 mb-6"
              errorText={errors.email?.message}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{
            required: 'Пароль обязателен',
            minLength: { value: 6, message: 'Пароль должен быть не менее 6 символов' },
          }}
          render={({ field }) => (
            <PasswordInput
              placeholder={'Пароль'}
              value={field.value}
              onChange={field.onChange}
              name={field.name}
              autoComplete="current-password"
              extraClass="mb-6"
              errorText={errors.password?.message}
            />
          )}
        />
        {error && (
          <p className="text text_type_main-default text_color_error mb-6">{error}</p>
        )}
        <Button
          type="primary"
          size="large"
          htmlType="submit"
          disabled={isLoading || !!errors.email || !!errors.password}
        >
          {isLoading ? <Preloader /> : 'Войти'}
        </Button>
        <div className="mt-20">
          <span className="text text_type_main-default">
            Вы - новый пользователь?&nbsp;
          </span>
          <Link to="/register" className="text text_type_main-default">
            Зарегистрироваться
          </Link>
        </div>
        <div className="mt-4">
          <span className="text text_type_main-default">Забыли пароль?&nbsp; </span>
          <Link to="/forgot-password" className="text text_type_main-default">
            Восстановить пароль
          </Link>
        </div>
      </form>
    </section>
  );
};

export default LoginPage;
