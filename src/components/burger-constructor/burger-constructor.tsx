import {
  ConstructorElement,
  DragIcon,
  CurrencyIcon,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import { Modal } from '../modal/modal';
import { OrderDetails } from './order-details/order-details';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
};

export const BurgerConstructor = ({
  ingredients,
}: TBurgerConstructorProps): React.JSX.Element => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const onClick = (): void => {
    console.log('Click');
    setModalVisible(true);
  };

  const onClose = (): void => {
    console.log('close');
    setModalVisible(false);
  };
  if (ingredients.length === 0) return <></>;

  return (
    <>
      <section className={styles.burger_constructor}>
        <div className={`${styles.external} ml-4 mr-4 mb-4`}>
          <ConstructorElement
            type="top"
            isLocked={true}
            text={ingredients[0].name + ' (верх)'}
            price={ingredients[0].price}
            thumbnail={ingredients[0].image}
          />
        </div>
        <div className={styles.internal}>
          {ingredients.map((ingredient, index) => {
            if (ingredient.type !== 'bun') {
              return (
                <div key={index} className={`${styles.ingredientElem} ml-4 mr-4 mb-4`}>
                  <DragIcon type="primary" />
                  <ConstructorElement
                    text={ingredient.name}
                    price={ingredient.price}
                    thumbnail={ingredient.image}
                  />
                </div>
              );
            }
            return null;
          })}
        </div>
        <div className="ml-4 mr-4 mb-4">
          <ConstructorElement
            type="bottom"
            isLocked={true}
            text={ingredients[0].name + ' (низ)'}
            price={ingredients[0].price}
            thumbnail={ingredients[0].image}
          />
        </div>
        <div className={`${styles.orderInfo} mt-10`}>
          <div className={`${styles.orderInfoPrice} mr-10`}>
            <p className="mr-1 text text_type_digits-medium">18783</p>
            <CurrencyIcon type="primary" />
          </div>
          <div className={styles.orderInfoButton}>
            <Button
              htmlType="button"
              type="primary"
              size="large"
              onClick={() => {
                onClick();
              }}
            >
              Оформить заказ
            </Button>
          </div>
        </div>
      </section>
      {modalVisible && (
        <Modal onClose={onClose}>
          <OrderDetails orderID={123123} />
        </Modal>
      )}
    </>
  );
};
