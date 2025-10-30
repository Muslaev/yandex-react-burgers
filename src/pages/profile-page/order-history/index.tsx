import { OrderList } from '@/components/order-list';
import { userFeedWsActions } from '@/services/actions/user-feed-ws';
import { selectIsAuthenticated } from '@/services/slices/user';
import { selectUserFeedIsConnected } from '@/services/slices/user-feed';
import { useAppSelector, useWsConnection } from '@/utils/hooks';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';

import styles from './order-history.module.css';

export const OrderHistory: React.FC = () => {
  const isConnected = useAppSelector(selectUserFeedIsConnected);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useWsConnection(userFeedWsActions, true);

  if (!isAuthenticated) {
    return (
      <p className="text text_type_main-default">
        Войдите, чтобы увидеть историю заказов
      </p>
    );
  }

  if (!isConnected) return <Preloader />;

  return (
    <div className={styles.container}>
      <OrderList />
    </div>
  );
};

export default OrderHistory;
