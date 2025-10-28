import { forgotPassword } from '@/services/actions/user';
import {
  selectIsUserLoading,
  selectUserError,
  selectPasswordResetRequested,
} from '@/services/slices/user';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import {
  Button,
  EmailInput,
  Preloader,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import styles from './forgot-password-page.module.css';

export type ForgotPasswordForm = {
  email: string;
};

export const ForgotPasswordPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    defaultValues: {
      email: '',
    },
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectIsUserLoading);
  const error = useAppSelector(selectUserError);
  const passwordResetRequested = useAppSelector(selectPasswordResetRequested);

  const onSubmit = async (data: ForgotPasswordForm): Promise<void> => {
    try {
      await dispatch(forgotPassword({ email: data.email })).unwrap();
    } catch (err) {
      console.error('Failed to send password reset request:', err);
    }
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    void handleSubmit(onSubmit)(e);
  };

  useEffect(() => {
    if (passwordResetRequested) {
      void navigate('/reset-password', { replace: true });
    }
  }, [passwordResetRequested, navigate]);

  return (
    <section className={styles.section_form_container}>
      <form className={styles.form_wrapper} onSubmit={onFormSubmit}>
        <h3 className="text text_type_main-medium">Восстановление пароля</h3>
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
        {error && (
          <p className="text text_type_main-default text_color_error mb-6">{error}</p>
        )}
        <Button
          type="primary"
          size="large"
          htmlType="submit"
          disabled={isLoading || !!errors.email}
        >
          {isLoading ? <Preloader /> : 'Восстановить'}
        </Button>
        <div className="mt-20">
          <span className="text text_type_main-default">Вспомнили пароль?&nbsp;</span>
          <Link to="/login" className="text text_type_main-default">
            Войти
          </Link>
        </div>
      </form>
    </section>
  );
};

export default ForgotPasswordPage;
