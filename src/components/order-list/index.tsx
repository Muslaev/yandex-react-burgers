import { selectFeedOrders, selectFeedIsConnected } from '@/services/slices/feed';
import {
  selectUserFeedOrders,
  selectUserFeedIsConnected,
} from '@/services/slices/user-feed';
import { useAppSelector } from '@/utils/hooks';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';

import { OrderElement } from '../order-element';

import styles from './order-list.module.css';

export const OrderList: React.FC = () => {
  const feedOrders = useAppSelector(selectFeedOrders);
  const userOrders = useAppSelector(selectUserFeedOrders);
  const userConnected = useAppSelector(selectUserFeedIsConnected);
  const feedConnected = useAppSelector(selectFeedIsConnected);
  const isProfile = window.location.pathname.includes('/profile');

  const orders = isProfile ? userOrders : feedOrders;
  const isConnected = isProfile ? userConnected : feedConnected;

  if (!isConnected || !orders) return <Preloader />;
  if (orders.length === 0)
    return (
      <span className="text text_type_main-default text_color_inactive">
        Заказов пока нет, но вы можете это исправить
      </span>
    );

  return (
    <section className={styles.container}>
      <div className={`${styles.wrapper} mr-4`}>
        {orders.map((order) => (
          <OrderElement key={order._id} order={order} />
        ))}
      </div>
    </section>
  );
};
