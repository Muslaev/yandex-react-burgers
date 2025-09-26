import { setIngredient } from '@/services/slices/ingredient-details';
import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useCallback } from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import type { AppDispatch } from '@services/index';
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
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const [, dragRef] = useDrag({
    type: ingredient.type,
    item: { ingredient },
  });

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        dragRef(node);
      }
    },
    [dragRef]
  );

  const onClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
    void dispatch(setIngredient(ingredient));
    void navigate(`/ingredients/${ingredient._id}`, {
      state: { background: location },
    });
  };

  return (
    <div className={`${styles.ingredient_card_container}`} onClick={onClick} ref={ref}>
      {count > 0 && <Counter count={count} />}
      <img src={ingredient.image} alt={ingredient.name} className={`${styles.image}`} />
      <div className={`${styles.price_container} mt-1 mb-1`}>
        <span className={`text text_type_digits-default mr-1`}>{ingredient.price}</span>
        <CurrencyIcon type="primary" />
      </div>
      <div className={`text text_type_main-small`}>{ingredient.name}</div>
    </div>
  );
};
