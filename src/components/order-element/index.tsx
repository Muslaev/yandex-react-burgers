import { useAppSelector } from '@/utils/hooks';
import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { TOrderItem } from '@/utils/types';
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

  const displayedIngredients = useMemo(() => {
    return order.ingredients.slice(0, maxShownItems).map((ingredientId, i) => {
      const item = ingredients.find((elem) => elem._id === ingredientId);
      return { item, index: i };
    });
  }, [order.ingredients, ingredients]);

  const orderAmount = useMemo(
    () =>
      order.ingredients.reduce((amount: number, ingredientId: string) => {
        const item = ingredients.find((elem) => elem._id === ingredientId);
        return amount + (item?.price ?? 0);
      }, 0),
    [order.ingredients, ingredients]
  );

  const hiddenCount = Math.max(order.ingredients.length - maxShownItems, 0);

  const onClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
    void navigate(`${location.pathname}/${order.number}`, {
      state: { background: location },
    });
  };

  return (
    <div onClick={onClick} className={`${styles.order_card} mr-4`}>
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
        <ul className={styles.images_selection}>
          {displayedIngredients.map(({ item, index }, arrayIndex) => {
            const isSixth = index === maxShownItems - 1;
            const showCounter = hiddenCount > 0 && isSixth;

            return (
              <li
                key={`${item?._id ?? 'unknown'}-${index}`}
                className={styles.image_fill}
                style={{
                  zIndex: displayedIngredients.length - arrayIndex,
                  marginRight:
                    arrayIndex < displayedIngredients.length - 1 ? '-16px' : '0',
                }}
              >
                <img
                  src={item?.image_mobile}
                  alt={item?.name}
                  className={styles.image_position}
                  style={{ opacity: showCounter ? 0.6 : 1 }}
                />
                {showCounter && (
                  <span className={styles.count_hidden}>+{hiddenCount}</span>
                )}
              </li>
            );
          })}
        </ul>

        <div className={styles.price}>
          <span className="text text_type_digits-default">{orderAmount}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};
