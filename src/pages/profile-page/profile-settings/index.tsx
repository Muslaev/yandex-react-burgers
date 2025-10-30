import { updateUser } from '@/services/actions/user';
import {
  selectUser,
  selectInitialUser,
  resetUserToInitial,
  selectIsUserLoading,
  selectUserError,
} from '@/services/slices/user';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import {
  Input,
  EmailInput,
  PasswordInput,
  Button,
  Preloader,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import styles from './profile-settings.module.css';

export type IProfileForm = {
  email: string;
  name: string;
  password: string;
};

export const ProfileSettings: React.FC = () => {
  const user = useAppSelector(selectUser);
  const initialUser = useAppSelector(selectInitialUser);
  const isLoading = useAppSelector(selectIsUserLoading);
  const error = useAppSelector(selectUserError);
  const dispatch = useAppDispatch();
  const nameRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<IProfileForm>({
    defaultValues: {
      email: user?.email ?? '',
      name: user?.name ?? '',
      password: '',
    },
  });

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (!disabled && nameRef.current) {
      nameRef.current.focus();
    }
  }, [disabled]);

  useEffect(() => {
    reset({
      email: user?.email ?? '',
      name: user?.name ?? '',
      password: '',
    });
    setDisabled(true);
  }, [user, reset]);

  const onSubmit = async (data: IProfileForm): Promise<void> => {
    try {
      await dispatch(
        updateUser({
          email: data.email,
          name: data.name,
          password: data.password || undefined,
        })
      ).unwrap();
      setDisabled(true);
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    void handleSubmit(onSubmit)(e);
  };

  const onReset = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (initialUser) {
      reset({
        email: initialUser.email,
        name: initialUser.name,
        password: '',
      });
      dispatch(resetUserToInitial());
      setDisabled(true);
    }
  };

  const onIconClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDisabled(!disabled);
  };

  const onBlurName = (): void => {
    setDisabled(true);
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={onFormSubmit} onReset={onReset}>
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Имя обязательно' }}
          render={({ field }) => (
            <Input
              icon="EditIcon"
              placeholder="Имя"
              value={field.value}
              name={field.name}
              ref={nameRef}
              onIconClick={onIconClick}
              onChange={field.onChange}
              onBlur={() => {
                field.onBlur();
                onBlurName();
              }}
              disabled={disabled}
              extraClass="mb-6"
              error={!!errors.name}
              errorText={errors.name?.message}
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
              isIcon={true}
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
          render={({ field }) => (
            <PasswordInput
              placeholder="Пароль"
              icon="EditIcon"
              size="default"
              value={field.value}
              onChange={field.onChange}
              name={field.name}
              autoComplete="off"
              extraClass="mb-6"
              errorText={errors.password?.message}
            />
          )}
        />
        {isDirty && (
          <div className={styles.group_button}>
            <Button type="secondary" size="medium" htmlType="reset" disabled={isLoading}>
              Отмена
            </Button>
            <Button
              type="primary"
              size="medium"
              htmlType="submit"
              disabled={isLoading || !isDirty}
            >
              {isLoading ? <Preloader /> : 'Сохранить'}
            </Button>
          </div>
        )}
        {error && (
          <p className="text text_type_main-default text_color_error mt-4">{error}</p>
        )}
      </form>
    </div>
  );
};

export default ProfileSettings;
