import styles from './order-details.module.css';

type OrderDetailsProps = {
  orderID: number;
};

export const OrderDetails = ({ orderID }: OrderDetailsProps): React.JSX.Element => {
  return (
    <div>
      <div className={`${styles.orderId} text text_type_digits-large mt-30`}>
        {orderID}
      </div>
      <div className={`${styles.text} text text_type_main-medium mt-8`}>
        идентификатор заказа
      </div>
      <div className={`${styles.imageBox} mb-15 mt-15`}></div>
      <p className={`${styles.text} text text_type_main-small mb-2`}>
        Ваш заказ начали готовить
      </p>
      <p
        className={`${styles.text} text text_type_main-small text_color_inactive mb-30`}
      >
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};
