import { OrderList } from '@/components/order-list';
import { OrderStatistic } from '@/components/order-statistics';
import { feedWsActions } from '@/services/actions/feed-ws';
import { useAppSelector, useWsConnection } from '@/utils/hooks';

import styles from './feed-page.module.css';

export const FeedPage = (): React.JSX.Element => {
  const isConnected = useAppSelector((state) => state.feed.isConnected);

  useWsConnection(feedWsActions);

  if (!isConnected) return <p>Подключение...</p>;

  return (
    <section className={styles.wrapper}>
      <h3 className="text text_type_main-large mt-10 mb-5">Лента заказов</h3>
      <div className={styles.content}>
        <OrderList />
        <OrderStatistic />
      </div>
    </section>
  );
};
