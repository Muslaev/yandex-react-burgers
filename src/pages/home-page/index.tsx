import { useAppSelector } from '@/utils/hooks';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import {
  selectError,
  selectErrorMessage,
  selectIsLoading,
} from '@services/slices/ingredients';

import styles from './home-page.module.css';

export const HomePage = (): React.JSX.Element => {
  const isLoading = useAppSelector(selectIsLoading);
  const hasError = useAppSelector(selectError);
  const errorMessage = useAppSelector(selectErrorMessage);

  return (
    <>
      {hasError ? (
        <p>Error occurred: {errorMessage ?? 'Unknown error'}</p>
      ) : isLoading ? (
        <Preloader />
      ) : (
        <>
          <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
            Соберите бургер
          </h1>
          <main className={`${styles.main} pl-5 pr-5 pb-10`}>
            <DndProvider backend={HTML5Backend}>
              <BurgerIngredients />
              <BurgerConstructor />
            </DndProvider>
          </main>
        </>
      )}
    </>
  );
};
