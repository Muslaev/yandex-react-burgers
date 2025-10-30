import { fetchOrderByNumber } from '@/services/actions/order-details';
import { selectFeedOrders } from '@/services/slices/feed';
import { selectIngredients } from '@/services/slices/ingredients';
import {
  selectOrderDetails,
  selectOrderDetailsError,
  selectOrderDetailsLoading,
} from '@/services/slices/order-details';
import { selectUserFeedOrders } from '@/services/slices/user-feed';
import { useAppSelector, useAppDispatch } from '@/utils/hooks';
import {
  CurrencyIcon,
  FormattedDate,
  Preloader,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import type { TIngredient, TIngredientWithCounter } from '@/utils/types';

import styles from './order-info.module.css';

export const OrderInfo = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const orderNumber = id ? Number(id) : null;

  const orderInDetails = useAppSelector(selectOrderDetails);
  const feedOrders = useAppSelector(selectFeedOrders);
  const userFeedOrders = useAppSelector(selectUserFeedOrders);
  const ingredients = useAppSelector(selectIngredients);
  const isLoading = useAppSelector(selectOrderDetailsLoading);
  const error = useAppSelector(selectOrderDetailsError);

  const orderInFeed = useMemo(
    () => feedOrders.find((o) => o.number === orderNumber),
    [feedOrders, orderNumber]
  );

  const orderInUserFeed = useMemo(
    () => userFeedOrders.find((o) => o.number === orderNumber),
    [userFeedOrders, orderNumber]
  );

  const order = orderInDetails ?? orderInFeed ?? orderInUserFeed;

  const orderIngredients = useMemo(() => {
    if (!order) return [];

    const group: Record<string, TIngredientWithCounter> = {};

    for (const itemId of order.ingredients) {
      const ingredient = ingredients.find((elem: TIngredient) => elem._id === itemId);
      if (ingredient) {
        if (!group[itemId]) {
          group[itemId] = { ...ingredient, count: 0 };
        }
        group[itemId].count += 1;
      }
    }

    return Object.values(group);
  }, [order, ingredients]);

  const orderAmount = useMemo(() => {
    return orderIngredients.reduce((sum, item) => sum + item.price * item.count, 0);
  }, [orderIngredients]);

  const orderStatus = useMemo(() => {
    if (!order) return '';
    return order.status === 'done'
      ? 'Выполнен'
      : order.status === 'pending'
        ? 'Готовится'
        : 'Создан';
  }, [order]);

  useEffect(() => {
    if (!orderNumber || isNaN(orderNumber)) return;
    if (order) return;

    void dispatch(fetchOrderByNumber(orderNumber));
  }, [dispatch, orderNumber, order]);

  if (isLoading) {
    return (
      <main className={styles.main_container}>
        <p className="text text_type_main-default">Загрузка заказа...</p>
        <Preloader />
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.main_container}>
        <p className="text text_type_main-default text_color_inactive">
          Ошибка: {error}
        </p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className={styles.main_container}>
        <p className="text text_type_main-default">Заказ не найден</p>
      </main>
    );
  }

  const statusColor = order.status === 'done' ? styles.status_done : '';

  return (
    <main className={styles.main_container}>
      <p className={`text text_type_digits-default mt-4 mb-10 ${styles.orderNr}`}>
        #{order.number}
      </p>

      <h3 className="text text_type_main-medium mb-3">{order.name}</h3>

      <p className={`text text_type_main-default mb-10 ${statusColor}`}>{orderStatus}</p>

      <p className="text text_type_main-medium mb-2">Состав:</p>

      <section className={`${styles.orderBackground} custom-scroll`}>
        <ul className={styles.ingredientsList}>
          {orderIngredients.map((item) => (
            <li key={item._id} className="mt-4 mr-6">
              <div className={styles.rowIngredient}>
                <div className={styles.imageName}>
                  <div className={styles.imageBackground}>
                    <img
                      src={item.image_mobile}
                      alt={item.name}
                      className={styles.image}
                    />
                  </div>
                  <p className="text text_type_main-default ml-4">{item.name}</p>
                </div>
                <div className={styles.price}>
                  <span className="text text_type_digits-default mr-2">
                    {item.count} x {item.price}
                  </span>
                  <CurrencyIcon type="primary" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={`mt-10 mb-6 ${styles.dateOrder}`}>
        <FormattedDate
          date={new Date(order.createdAt)}
          className="text text_type_main-default text_color_inactive"
        />
        <div className={styles.price}>
          <span className="text text_type_digits-default mr-2">{orderAmount}</span>
          <CurrencyIcon type="primary" />
        </div>
      </section>
    </main>
  );
};
