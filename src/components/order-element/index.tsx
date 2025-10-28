import { useAppSelector } from '@/utils/hooks';
import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { TIngredient, TOrderItem } from '@/utils/types';
import type { FC } from 'react';

import styles from './order-element.module.css';

type TOrderData = {
  order: TOrderItem;
};

export const OrderElement: FC<TOrderData> = ({ order }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const maxShownItems = 6;

  const { ingredients } = useAppSelector((state) => state.ingredients);

  const orderStatus = useMemo(
    () =>
      order.status === 'done'
        ? 'Выполнен'
        : order.status === 'created'
          ? 'Создан'
          : 'Готовится',
    [order]
  );

  const colorStatus = useMemo(
    () => (order.status === 'done' ? styles.status_done : styles.status_default),
    [order]
  );

  const orderIngredients = useMemo(
    () =>
      order.ingredients.map((elemId: string) =>
        ingredients.find((elem: TIngredient) => elem._id === elemId)
      ),
    [ingredients, order.ingredients]
  );

  const firstItems = useMemo(
    () => orderIngredients.slice(0, maxShownItems),
    [orderIngredients]
  );

  const orderAmount = useMemo(
    () =>
      orderIngredients.reduce((amount: number, elem: TIngredient | undefined) => {
        return amount + (elem?.price ?? 0);
      }, 0),
    [orderIngredients]
  );

  const onClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
    void navigate(`${location.pathname}/${order.number}`, {
      state: { background: location },
    });
  };

  return (
    <div onClick={onClick} className={styles.order_card}>
      <div className="m-6">
        <div className={styles.order_header}>
          <p className="text text_type_digits-default">#{order.number}</p>
          <FormattedDate
            date={new Date(order.createdAt)}
            className="text text_type_main-default text_color_inactive"
          />
        </div>
      </div>

      <p className={`${styles.title_order} text text_type_main-medium`}>{order.name}</p>

      {orderStatus && (
        <p
          className={`${styles.status_order} ${colorStatus} text text_type_main-default`}
        >
          {orderStatus}
        </p>
      )}

      <div className={styles.filling}>
        <div className={styles.images_selection}>
          {firstItems.map((item, i) => {
            const hiddenCount = Math.max(order.ingredients.length - maxShownItems, 0);
            const isLast = i === maxShownItems - 1;
            const showCounter = hiddenCount > 0 && isLast;

            return (
              <li
                key={item?._id ?? i}
                style={{ marginLeft: i === 0 ? 0 : -16, zIndex: firstItems.length - i }}
                className={styles.image_fill}
              >
                <img
                  style={{ opacity: showCounter ? 0.6 : 1 }}
                  src={item?.image_mobile}
                  alt={item?.name}
                  className={styles.image_position}
                />
                {showCounter && (
                  <span className={styles.count_hidden}>+{hiddenCount}</span>
                )}
              </li>
            );
          })}
        </div>

        <div className={styles.price}>
          <span className="text text_type_digits-default">{orderAmount}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};
