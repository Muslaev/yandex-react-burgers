import type { TIngredient } from '@utils/types';

import styles from './ingredient-details.module.css';

type IngredientDetailsProps = {
  ingredient: TIngredient;
};

export const IngredientDetails = ({
  ingredient,
}: IngredientDetailsProps): React.JSX.Element => {
  return (
    <>
      <div className={styles.mainContainer}>
        <img alt={ingredient.name} src={ingredient.image_large} />
        <p className={`${styles.ingredientNameText} text text_type_main-medium mt-4`}>
          {ingredient.name}
        </p>
        <div className={`${styles.macronutrientContainer} mt-8 mb-15`}>
          <div className={styles.macronutrientElem} key="calories">
            <p className="text text_type_main-small text_color_inactive">
              Калории, ккал
            </p>
            <p className="text text_type_digits-default text_color_inactive">
              {ingredient.calories}
            </p>
          </div>
          <div className={styles.macronutrientElem} key="proteins">
            <p className="text text_type_main-small text_color_inactive">Белки, г</p>
            <p className="text text_type_digits-default text_color_inactive">
              {ingredient.proteins}
            </p>
          </div>
          <div className={styles.macronutrientElem} key="fat">
            <p className="text text_type_main-small text_color_inactive">Жиры, г</p>
            <p className="text text_type_digits-default text_color_inactive">
              {ingredient.fat}
            </p>
          </div>
          <div className={styles.macronutrientElem} key="carbohydrates">
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
