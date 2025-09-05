import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useState, useEffect } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import type { TIngredient } from '@utils/types';

import styles from './app.module.css';

type ApiResponse = {
  success: boolean;
  data: TIngredient[];
};

export const App = (): React.JSX.Element => {
  type IngredientsState = {
    isLoading: boolean;
    hasError: boolean;
    ingredients: TIngredient[];
  };

  const [ingredientsRequest, setIngredientsRequest] = useState<IngredientsState>({
    isLoading: false,
    hasError: false,
    ingredients: [],
  });

  // URL для запроса ингредиентов
  const ingredientsURL = 'https://norma.nomoreparties.space/api/ingredients';

  async function getIngredients(): Promise<void> {
    try {
      setIngredientsRequest({ ...ingredientsRequest, hasError: false, isLoading: true });
      const response = await fetch(ingredientsURL);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      // Получаем данные как unknown и проверяем их структуру
      const rawData: unknown = await response.json();
      // Проверяем, соответствует ли структура данных интерфейсу ApiResponse
      if (
        rawData &&
        typeof rawData === 'object' &&
        'success' in rawData &&
        typeof rawData.success === 'boolean' &&
        'data' in rawData &&
        Array.isArray(rawData.data)
      ) {
        const data: ApiResponse = rawData as ApiResponse;
        if (!data.success) {
          throw new Error('API request failed');
        }
        setIngredientsRequest({
          ...ingredientsRequest,
          ingredients: data.data,
          isLoading: false,
        });
      } else {
        throw new Error('Invalid API response structure');
      }
    } catch (e) {
      setIngredientsRequest({ ...ingredientsRequest, hasError: true, isLoading: false });
      if (e instanceof Error) {
        alert(e.message);
      } else {
        alert('Unknown error');
      }
    }
  }

  useEffect(() => {
    void getIngredients();
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      {ingredientsRequest.hasError ? (
        <p>Error occurred</p>
      ) : ingredientsRequest.isLoading ? (
        <Preloader />
      ) : (
        <>
          <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
            Соберите бургер
          </h1>
          <main className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients ingredients={ingredientsRequest.ingredients} />
            <BurgerConstructor ingredients={ingredientsRequest.ingredients} />
          </main>
        </>
      )}
    </div>
  );
};

export default App;
