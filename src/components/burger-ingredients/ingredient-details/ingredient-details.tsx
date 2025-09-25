import { selectIngredient } from '@/services/slices/ingredient-details';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useSelector } from 'react-redux';

import styles from './ingredient-details.module.css';

export const IngredientDetails = (): React.JSX.Element => {
  const ingredient = useSelector(selectIngredient)!;

  if (!ingredient) {
    return <Preloader />;
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
