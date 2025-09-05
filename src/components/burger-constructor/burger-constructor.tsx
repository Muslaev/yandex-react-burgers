import { Modal } from '@/components/modal/modal';
import {
  ConstructorElement,
  DragIcon,
  CurrencyIcon,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

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
      <section className={`${styles.burger_constructor} pb-5`}>
        <div className={`${styles.outter} pl-6 ml-4 mr-4 mb-4`}>
          <ConstructorElement
            type="top"
            isLocked={true}
            text={ingredients[0].name + ' (верх)'}
            price={ingredients[0].price}
            thumbnail={ingredients[0].image}
          />
        </div>
        <div className={styles.inner}>
          {ingredients.map((ingredient, index) => {
            if (ingredient.type !== 'bun') {
              return (
                <div key={index} className={`${styles.element} ml-4 mr-4 mb-4`}>
                  <DragIcon type="primary" className="mr-1" />
                  <ConstructorElement
                    text={ingredient.name}
                    price={ingredient.price}
                    thumbnail={ingredient.image_mobile}
                  />
                </div>
              );
            }
            return null;
          })}
        </div>
        <div className={`${styles.outter} pl-6 ml-4 mr-4 mt-4`}>
          <ConstructorElement
            type="bottom"
            isLocked={true}
            text={ingredients[0].name + ' (низ)'}
            price={ingredients[0].price}
            thumbnail={ingredients[0].image}
          />
        </div>
        <div className={`${styles.order} mt-10`}>
          <div className={`${styles.price} mr-10`}>
            <p className="text text_type_digits-medium mr-1">999999</p>
            <CurrencyIcon type="primary" />
          </div>
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
      </section>
      {modalVisible && (
        <Modal onClose={onClose}>
          <OrderDetails orderID={123123} />
        </Modal>
      )}
    </>
  );
};
