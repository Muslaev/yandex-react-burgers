import { selectIsLoading, selectError } from '@/services/slices/ingredients';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useSelector } from 'react-redux';

import { IngredientDetails } from '@components/burger-ingredients/ingredient-details/ingredient-details';

import styles from './ingredients-page.module.css';

export const IngredientPage = (): React.JSX.Element => {
  const isLoading = useSelector(selectIsLoading);
  const hasError = useSelector(selectError);

  if (isLoading) {
    return <Preloader />;
  }

  if (hasError) {
    return <p className="text text_type_main-medium">Ошибка загрузки данных</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className="text text_type_main-large mt-10">Детали ингредиента</h1>
      <IngredientDetails />
    </div>
  );
};
