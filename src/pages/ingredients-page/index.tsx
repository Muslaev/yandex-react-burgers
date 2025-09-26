import { setIngredient } from '@/services/slices/ingredient-details';
import {
  selectIngredients,
  selectIsLoading,
  selectError,
} from '@/services/slices/ingredients';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { IngredientDetails } from '@components/burger-ingredients/ingredient-details/ingredient-details';

import type { AppDispatch } from '@services/index';

import styles from './ingredients-page.module.css';

export const IngredientPage = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectIsLoading);
  const hasError = useSelector(selectError);

  useEffect(() => {
    if (id) {
      const ingredient = ingredients.find((item) => item._id === id);
      if (ingredient) {
        dispatch(setIngredient(ingredient));
      }
    }
  }, [dispatch, id, ingredients]);

  if (isLoading) {
    return <Preloader />;
  }

  if (hasError) {
    return <p className="text text_type_main-medium">Ошибка загрузки данных</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className="text text_type_main-large mt-10">Детали ингредиента</h1>
      <IngredientDetails />
    </div>
  );
};
