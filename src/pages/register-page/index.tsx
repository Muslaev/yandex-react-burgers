import { registerUser } from '@/services/actions/user';
import {
  selectIsAuthenticated,
  selectIsUserLoading,
  selectUserError,
} from '@/services/slices/user';
import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
  Preloader,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import type { AppDispatch } from '@/services';

import styles from './register-page.module.css';

export type RegisterForm = {
  email: string;
  password: string;
  name: string;
};

type LocationState = {
  from?: {
    pathname: string;
  };
};

export const RegisterPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsUserLoading);
  const error = useSelector(selectUserError);

  const onSubmit = async (data: RegisterForm): Promise<void> => {
    try {
      await dispatch(
        registerUser({
          email: data.email,
          password: data.password,
          name: data.name,
        })
      ).unwrap();
    } catch (err) {
      console.error('Failed to register:', err);
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
        <h3 className="text text_type_main-medium">Регистрация</h3>
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Имя обязательно' }}
          render={({ field }) => (
            <Input
              type="text"
              placeholder="Имя"
              size="default"
              value={field.value}
              onChange={field.onChange}
              name={field.name}
              error={!!errors.name}
              errorText={errors.name?.message}
              autoComplete="off"
              extraClass="mt-6 mb-6"
            />
          )}
        />
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
              placeholder="Email"
              isIcon={false}
              value={field.value}
              onChange={field.onChange}
              name={field.name}
              autoComplete="off"
              extraClass="mb-6"
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
              placeholder="Пароль"
              value={field.value}
              onChange={field.onChange}
              name={field.name}
              autoComplete="new-password"
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
          disabled={isLoading || !!errors.email || !!errors.password || !!errors.name}
        >
          {isLoading ? <Preloader /> : 'Зарегистрироваться'}
        </Button>
        <div className="mt-20">
          <span className="text text_type_main-default">
            Уже зарегистрированы?&nbsp;
          </span>
          <Link to="/login" className="text text_type_main-default">
            Войти
          </Link>
        </div>
      </form>
    </section>
  );
};

export default RegisterPage;
