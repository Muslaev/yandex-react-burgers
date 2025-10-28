import {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
} from '@/services/slices/feed';
import { useAppSelector } from '@/utils/hooks';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import type React from 'react';

import styles from './order-statistics.module.css';

export const OrderStatistic: React.FC = () => {
  const orders = useAppSelector(selectFeedOrders);
  const total = useAppSelector(selectFeedTotal);
  const totalToday = useAppSelector(selectFeedTotalToday);

  const doneOrders = useMemo(() => {
    return orders.filter((order) => order.status === 'done');
  }, [orders]);

  const inProgressOrders = useMemo(() => {
    return orders.filter((order) => order.status !== 'done');
  }, [orders]);

  if (!orders) return <Preloader />;

  return (
    <div className={styles.wrapper}>
      <div className={styles.top_wrapper}>
        <div className={styles.content}>
          <p className="text text_type_main-medium mb-6">Готовы:</p>
          <div className={`${styles.items} custom-scroll`}>
            {doneOrders.map((done, index) => (
              <p
                className={`text text_type_digits-default ${styles.item_done}`}
                key={index}
              >
                {done.number}
              </p>
            ))}
          </div>
        </div>
        <div className={styles.content}>
          <p className="text text_type_main-medium mb-6">В работе:</p>
          <div className={`${styles.items} custom-scroll`}>
            {inProgressOrders.map(
              (inProgress, index) =>
                !!inProgress && (
                  <p
                    className={`text text_type_digits-default mb-2 ${styles.item_work}`}
                    key={index}
                  >
                    {inProgress.number}
                  </p>
                )
            )}
          </div>
        </div>
      </div>
      <div>
        <p className="text text_type_main-medium mt-15">Выполнено за все время:</p>
        <p className="text text_type_digits-large">{total}</p>
        <p className="text text_type_main-medium mt-15">Выполнено за сегодня:</p>
        <p className="text text_type_digits-large">{totalToday}</p>
      </div>
    </div>
  );
};
