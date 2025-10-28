import {
  selectIngredients,
  selectIsLoading,
  selectError,
} from '@/services/slices/ingredients';
import { useAppSelector } from '@/utils/hooks';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import type { TIngredientWithCounter } from '@/utils/types';

import styles from './ingredient-details.module.css';

export const IngredientDetails = (): React.JSX.Element => {
  const [ingredient, setIngredient] = useState<TIngredientWithCounter>();
  const ingredients = useAppSelector(selectIngredients);
  const isLoading = useAppSelector(selectIsLoading);
  const hasError = useAppSelector(selectError);
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    if (id) {
      const ingredient = ingredients.find(
        (item: TIngredientWithCounter) => item._id === id
      );
      if (ingredient) {
        setIngredient(ingredient);
      }
    }
  }, [id, ingredients]);

  if (isLoading) {
    return <Preloader />;
  }

  if (hasError || !ingredient) {
    return <p className="text text_type_main-medium">Ошибка загрузки данных</p>;
  }

  return (
    <>
      <div className={styles.main}>
        <img alt={ingredient.name} src={ingredient.image_large} />
        <p className={`text text_type_main-medium mt-4`}>{ingredient.name}</p>
        <div className={`${styles.container} mt-8 mb-15`}>
          <div className={styles.element}>
            <p className="text text_type_main-small text_color_inactive">
              Калории, ккал
            </p>
            <p className="text text_type_digits-default text_color_inactive">
              {ingredient.calories}
            </p>
          </div>
          <div className={styles.element}>
            <p className="text text_type_main-small text_color_inactive">Белки, г</p>
            <p className="text text_type_digits-default text_color_inactive">
              {ingredient.proteins}
            </p>
          </div>
          <div className={styles.element}>
            <p className="text text_type_main-small text_color_inactive">Жиры, г</p>
            <p className="text text_type_digits-default text_color_inactive">
              {ingredient.fat}
            </p>
          </div>
          <div className={styles.element}>
            <p className="text text_type_main-small text_color_inactive">Углеводы, г</p>
            <p className="text text_type_digits-default text_color_inactive">
              {ingredient.carbohydrates}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
