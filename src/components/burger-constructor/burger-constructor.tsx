import { Modal } from '@/components/modal/modal';
import {
  selectConstructorIngredients,
  selectConstructorBun,
  addIngredient,
} from '@/services/slices/constructor-slice';
import {
  selectIngredients,
  selectIsLoading,
  incrementCounter,
  decrementCounter,
} from '@/services/slices/ingredients-slice';
import {
  createOrder,
  resetOrder,
  selectIsOrderLoading,
  selectOrderNumber,
} from '@/services/slices/order-slice';
import {
  Preloader,
  ConstructorElement,
  CurrencyIcon,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useCallback, useMemo, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useSelector, useDispatch } from 'react-redux';

import { DraggableIngredient } from './draggable-ingredient/draggable-ingredient';
import { OrderDetails } from './order-details/order-details';

import type { TIngredientWithCounter } from '@/services/slices/ingredients-slice';
import type { AppDispatch } from '@services/index';
import type { DropTargetMonitor } from 'react-dnd';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();

  const allIngredients = useSelector(selectIngredients);
  const ingredientsLoading = useSelector(selectIsLoading);

  const ingredients = useSelector(selectConstructorIngredients);
  const bun = useSelector(selectConstructorBun);

  const orderIsLoading = useSelector(selectIsOrderLoading);
  const orderNumber = useSelector(selectOrderNumber);

  const initialized = useRef(false);

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

  // Автоматически добавляем первую булку при загрузке ингредиентов, если булка ещё не выбрана
  useEffect(() => {
    if (
      !initialized.current &&
      !ingredientsLoading &&
      allIngredients &&
      allIngredients.length > 0 &&
      !bun
    ) {
      const firstBun = allIngredients.find((ingredient) => ingredient.type === 'bun');
      if (firstBun && typeof firstBun === 'object') {
        dispatch(addIngredient(firstBun));
        setTimeout(() => {
          dispatch(incrementCounter(firstBun._id));
        }, 0);
      }
      initialized.current = true;
    }
  }, [allIngredients, bun, ingredientsLoading, dispatch]);

  const onCreateOrderClick = (): void => {
    if (bun) {
      const orderIngredients = [bun._id, ...ingredients.map((ing) => ing._id), bun._id];
      void dispatch(createOrder(orderIngredients));
    }
  };

  const onCloseModal = (): void => {
    dispatch(resetOrder());
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
        className={`${styles.burger_constructor} pb-5 ${backgroundClass}`}
        ref={dropRef}
      >
        <div className={`${styles.outter} pl-6 ml-4 mr-4 mb-4`}>
          {bun ? (
            <ConstructorElement
              type="top"
              isLocked={true}
              text={bun.name + ' (верх)'}
              price={bun.price}
              thumbnail={bun.image}
            />
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
                <DraggableIngredient
                  key={ingredient.key}
                  ingredient={ingredient}
                  index={index}
                />
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
            <ConstructorElement
              type="bottom"
              isLocked={true}
              text={bun.name + ' (низ)'}
              price={bun.price}
              thumbnail={bun.image}
            />
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
