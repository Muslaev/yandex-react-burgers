import { Link } from 'react-router-dom';

import type React from 'react';

import styles from './not-found-page.module.css';

export const NotFoundPage: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <p className="text text_type_main-medium">Запрвшиваема страница не найдена.</p>
      <Link to="/" className="text text_type_main-default">
        Вернуться на главную
      </Link>
    </div>
  );
};
