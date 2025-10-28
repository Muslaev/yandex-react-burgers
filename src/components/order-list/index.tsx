import { useAppSelector } from '@/utils/hooks';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';

import { OrderElement } from '../order-element';

import styles from './order-list.module.css';

export const OrderList: React.FC = () => {
  const feedOrders = useAppSelector((state) => state.feed.orders);
  const userOrders = useAppSelector((state) => state.userFeed.orders);
  const isProfile = window.location.pathname.includes('/profile');

  const orders = isProfile ? userOrders : feedOrders;

  if (!orders || orders.length === 0) return <Preloader />;

  return (
    <div className={`${styles.wrapper} custom-scroll pr-2`}>
      {orders.map((order) => (
        <OrderElement key={order._id} order={order} />
      ))}
    </div>
  );
};
