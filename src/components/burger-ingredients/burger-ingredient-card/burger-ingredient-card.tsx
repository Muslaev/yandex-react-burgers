import { Modal } from '@/components/modal/modal';
import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import { IngredientDetails } from './ingredient-details/ingredient-details';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredient-card.module.css';

type TBurgerIngredientProps = {
  ingredient: TIngredient;
  count: number;
};

export const BurgerIngredientCard = ({
  ingredient,
  count,
}: TBurgerIngredientProps): React.JSX.Element => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const onClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
    setModalVisible(true);
  };

  const onClose = (): void => {
    setModalVisible(false);
  };

  return (
    <div className={`${styles.ingredient_card_container}`} onClick={onClick}>
      {count > 0 && <Counter count={count} />}
      <img src={ingredient.image} alt={ingredient.name} className={`${styles.image}`} />
      <div className={`${styles.price_container} mt-1 mb-1`}>
        <span className={`text text_type_digits-default mr-1`}>{ingredient.price}</span>
        <CurrencyIcon type="primary" />
      </div>
      <div className={`text text_type_main-small`}>{ingredient.name}</div>
      {modalVisible && (
        <Modal header="Детали ингредиента" onClose={onClose}>
          <IngredientDetails ingredient={ingredient} />
        </Modal>
      )}
    </div>
  );
};
