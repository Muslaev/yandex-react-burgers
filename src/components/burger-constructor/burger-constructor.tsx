import { Modal } from '@/components/modal/modal';
import { createOrder } from '@/services/actions/order';
import {
  selectConstructorIngredients,
  selectConstructorBun,
  addIngredient,
  clearIngredients,
} from '@/services/slices/burger-constructor';
import {
  incrementCounter,
  decrementCounter,
  clearCounters,
} from '@/services/slices/ingredients';
import {
  resetOrder,
  selectIsOrderLoading,
  selectOrderNumber,
} from '@/services/slices/order';
import { selectIsAuthenticated } from '@/services/slices/user';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import {
  Preloader,
  ConstructorElement,
  CurrencyIcon,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { useNavigate } from 'react-router-dom';

import { OrderDetails } from '../order-details/order-details';
import { DraggableIngredient } from './draggable-ingredient/draggable-ingredient';

import type { TIngredientWithCounter } from '@utils/types';
import type { DropTargetMonitor } from 'react-dnd';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const ingredients = useAppSelector(selectConstructorIngredients);
  const bun = useAppSelector(selectConstructorBun);

  const orderIsLoading = useAppSelector(selectIsOrderLoading);
  const orderNumber = useAppSelector(selectOrderNumber);

  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [{ isHover }, drop] = useDrop<
    { ingredient: TIngredientWithCounter },
    void,
    { isHover: boolean }
  >({
    accept: ['main', 'sauce', 'bun'] as const,
    collect: (monitor: DropTargetMonitor) => ({
      isHover: monitor.isOver(),
    }),
    drop(item: { ingredient: TIngredientWithCounter }) {
      if (bun && item.ingredient.type === 'bun') dispatch(decrementCounter(bun._id));
      dispatch(addIngredient(item.ingredient));
      dispatch(incrementCounter(item.ingredient._id));
    },
  });

  const dropRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        drop(node);
      }
    },
    [drop]
  );

  const onCreateOrderClick = (): void => {
    if (!isAuthenticated) {
      void navigate('/login');
      return;
    }
    if (bun) {
      const orderIngredients = [bun._id, ...ingredients.map((ing) => ing._id), bun._id];
      void dispatch(createOrder(orderIngredients));
    }
  };

  const onCloseModal = (): void => {
    dispatch(resetOrder());
    dispatch(clearIngredients());
    dispatch(clearCounters());
  };

  const totalPrice = useMemo(() => {
    return (
      (bun ? bun.price * 2 : 0) +
      (ingredients ? ingredients.reduce((sum, ing) => sum + ing.price, 0) : 0)
    );
  }, [bun, ingredients]);

  const canOrder = !!bun;

  const backgroundClass = isHover ? styles.background : '';

  return (
    <>
      <section
        data-testid="constructor-drop-target"
        className={`${styles.burger_constructor} pb-5 ${backgroundClass}`}
        ref={dropRef}
      >
        <div className={`${styles.outter} pl-6 ml-4 mr-4 mb-4`}>
          {bun ? (
            <div data-testid="bun-top">
              <ConstructorElement
                type="top"
                isLocked={true}
                text={bun.name + ' (верх)'}
                price={bun.price}
                thumbnail={bun.image}
              />
            </div>
          ) : (
            <p className="text text_type_main-default text_color_inactive">
              Выберите булку
            </p>
          )}
        </div>
        <div className={`${styles.inner}`}>
          {ingredients && ingredients.length > 0 ? (
            ingredients.map((ingredient, index) => {
              if (ingredient.type === 'bun') return null;
              return (
                <div key={ingredient.key} data-testid="constructor-ingredient">
                  <DraggableIngredient
                    key={ingredient.key}
                    ingredient={ingredient}
                    index={index}
                  />
                </div>
              );
            })
          ) : (
            <p className="text text_type_main-default text_color_inactive">
              Положите сюда ингредиенты
            </p>
          )}
        </div>

        <div className={`${styles.outter} pl-6 ml-4 mr-4 mt-4`}>
          {bun ? (
            <div data-testid="bun-bottom">
              <ConstructorElement
                type="bottom"
                isLocked={true}
                text={bun.name + ' (низ)'}
                price={bun.price}
                thumbnail={bun.image}
              />
            </div>
          ) : (
            <p className="text text_type_main-default text_color_inactive">
              Выберите булку
            </p>
          )}
        </div>

        <div className={`${styles.order} mt-10`}>
          <div className={`${styles.price} mr-10`}>
            <p className="text text_type_digits-medium mr-1">{totalPrice}</p>
            <CurrencyIcon type="primary" />
          </div>
          <Button
            htmlType="button"
            type="primary"
            size="large"
            disabled={!canOrder}
            onClick={onCreateOrderClick}
          >
            {orderIsLoading ? <Preloader /> : <>Оформить заказ</>}
          </Button>
        </div>
      </section>
      {orderNumber && (
        <Modal onClose={onCloseModal}>
          <OrderDetails />
        </Modal>
      )}
    </>
  );
};
