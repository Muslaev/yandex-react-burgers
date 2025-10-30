import { resetPassword } from '@/services/actions/user';
import { selectIsUserLoading, selectUserError } from '@/services/slices/user';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import {
  Button,
  Input,
  PasswordInput,
  Preloader,
} from '@krgaa/react-developer-burger-ui-components';
import { useForm, Controller } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import styles from './reset-password-page.module.css';

export type ResetPasswordForm = {
  password: string;
  token: string;
};

export const ResetPasswordPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    defaultValues: {
      password: '',
      token: '',
    },
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectIsUserLoading);
  const error = useAppSelector(selectUserError);

  const onSubmit = async (data: ResetPasswordForm): Promise<void> => {
    try {
      await dispatch(resetPassword(data)).unwrap();
      await navigate('/login', { replace: true });
    } catch (err) {
      console.error('Failed to reset password:', err);
    }
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    void handleSubmit(onSubmit)(e);
  };

  return (
    <section className={styles.section_form_container}>
      <form className={styles.form_wrapper} onSubmit={onFormSubmit}>
        <h3 className="text text_type_main-medium">Восстановление пароля</h3>
        <Controller
          name="password"
          control={control}
          rules={{ required: 'Пароль обязателен' }}
          render={({ field }) => (
            <PasswordInput
              placeholder={'Введите новый пароль'}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              autoComplete="new-password"
              extraClass="mt-6 mb-6"
            />
          )}
        />
        <Controller
          name="token"
          control={control}
          rules={{ required: 'Код обязателен' }}
          render={({ field }) => (
            <Input
              type="text"
              placeholder={'Введите код из письма'}
              size="default"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              error={!!errors.token}
              errorText={errors.token?.message}
              autoComplete="off"
              extraClass="mb-6"
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
          disabled={isLoading || !!errors.password || !!errors.token}
        >
          {isLoading ? <Preloader /> : 'Сохранить'}
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

export default ResetPasswordPage;
