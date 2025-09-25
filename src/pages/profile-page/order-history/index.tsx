import type React from 'react';

import styles from './order-history.module.css';

export const OrderHistory: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2 className="text text_type_main-large">История заказов</h2>
      <p className="text text_type_main-default text_color_inactive">
        Здесь будет отображаться история ваших заказов.
      </p>
    </div>
  );
};

export default OrderHistory;
