import { fetchIngredients } from '@/services/actions/ingredients';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/burger-ingredients/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import {
  removeIngredient,
  selectIngredient,
  setIngredient,
} from '@services/slices/ingredient-details';
import {
  selectIngredients,
  selectError,
  selectErrorMessage,
  selectIsLoading,
} from '@services/slices/ingredients';

import type { AppDispatch } from '@services/index';

import styles from './home-page.module.css';

export const HomePage = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const isLoading = useSelector(selectIsLoading);
  const hasError = useSelector(selectError);
  const errorMessage = useSelector(selectErrorMessage);
  const ingredients = useSelector(selectIngredients);

  const ingredient = useSelector(selectIngredient);

  const ingredientID = searchParams.get('id');

  useEffect(() => {
    if (!ingredients.length) {
      void dispatch(fetchIngredients());
    } else if (ingredientID) {
      const ingredient = ingredients.find((item) => item._id === ingredientID);
      if (ingredient) {
        dispatch(setIngredient(ingredient));
      }
    }
  }, [dispatch, ingredientID, ingredients]);

  const handleCloseModal = (): void => {
    dispatch(removeIngredient());
    setSearchParams({});
  };

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
          {ingredientID && ingredient && (
            <Modal onClose={handleCloseModal} header="Детали ингредиента">
              <IngredientDetails />
            </Modal>
          )}
        </>
      )}
    </>
  );
};
