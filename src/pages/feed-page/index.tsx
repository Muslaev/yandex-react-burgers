import { OrderList } from '@/components/order-list';
import { OrderStatistic } from '@/components/order-statistics';
import { feedWsActions } from '@/services/actions/feed-ws';
import { useAppSelector, useWsConnection } from '@/utils/hooks';

import styles from './feed-page.module.css';

export const FeedPage = (): React.JSX.Element => {
  const isConnected = useAppSelector((state) => state.feed.isConnected);

  useWsConnection(feedWsActions);

  if (!isConnected) return <p className="text text_type_main-default">Подключение...</p>;

  return (
    <>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5`}>
        Лента заказов
      </h1>
      <main className={`${styles.main} pl-5 pr-5 pb-10`}>
        <OrderList />
        <OrderStatistic />
      </main>
    </>
  );
};
