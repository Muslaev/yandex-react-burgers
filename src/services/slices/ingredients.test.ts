import { fetchIngredients } from '../actions/ingredients';
import reducer, {
  incrementCounter,
  decrementCounter,
  clearCounters,
} from './ingredients';

import type { IngredientsState } from '@/utils/types';

const mockIngredient1 = {
  _id: '1',
  name: 'Булка',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 150,
  calories: 420,
  price: 1255,
  image: 'image1.jpg',
  image_large: 'image1_large.jpg',
  image_mobile: 'image1_mobile.jpg',
  __v: 0,
  count: 0,
};

const mockIngredient2 = {
  _id: '2',
  name: 'Соус',
  type: 'sauce',
  proteins: 50,
  fat: 20,
  carbohydrates: 10,
  calories: 100,
  price: 50,
  image: 'image2.jpg',
  image_large: 'image2_large.jpg',
  image_mobile: 'image2_mobile.jpg',
  __v: 0,
  count: 0,
};

describe('ingredients slice', () => {
  const initialState: IngredientsState = {
    ingredients: [],
    isLoading: false,
    hasError: false,
    errorMessage: undefined,
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('fetchIngredients', () => {
    it('should set isLoading true on pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: true,
        hasError: false,
        errorMessage: undefined,
      });
    });

    it('should set ingredients and reset loading on fulfilled', () => {
      const payload = [mockIngredient1, mockIngredient2];
      const action = { type: fetchIngredients.fulfilled.type, payload };
      const state = reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        ingredients: [
          { ...mockIngredient1, count: 0 },
          { ...mockIngredient2, count: 0 },
        ],
      });
    });

    it('should set error on rejected', () => {
      const errorMessage = 'Network error';
      const action = {
        type: fetchIngredients.rejected.type,
        payload: errorMessage,
      };
      const state = reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        hasError: true,
        errorMessage,
      });
    });
  });

  describe('incrementCounter', () => {
    const stateWithIngredients: IngredientsState = {
      ...initialState,
      ingredients: [
        { ...mockIngredient1, count: 0 },
        { ...mockIngredient2, count: 1 },
      ],
    };

    it('should increment counter for matching ingredient', () => {
      const state = reducer(stateWithIngredients, incrementCounter('1'));
      expect(state.ingredients[0].count).toBe(1);
      expect(state.ingredients[1].count).toBe(1);
    });

    it('should not affect non-matching ingredients', () => {
      const state = reducer(stateWithIngredients, incrementCounter('999'));
      expect(state.ingredients[0].count).toBe(0);
      expect(state.ingredients[1].count).toBe(1);
    });
  });

  describe('decrementCounter', () => {
    const stateWithIngredients: IngredientsState = {
      ...initialState,
      ingredients: [
        { ...mockIngredient1, count: 2 },
        { ...mockIngredient2, count: 0 },
      ],
    };

    it('should decrement counter if greater than 0', () => {
      const state = reducer(stateWithIngredients, decrementCounter('1'));
      expect(state.ingredients[0].count).toBe(1);
    });

    it('should not go below 0', () => {
      const state = reducer(stateWithIngredients, decrementCounter('2'));
      expect(state.ingredients[1].count).toBe(0);
    });
  });

  describe('clearCounters', () => {
    const stateWithIngredients: IngredientsState = {
      ...initialState,
      ingredients: [
        { ...mockIngredient1, count: 5 },
        { ...mockIngredient2, count: 3 },
      ],
    };

    it('should reset all counters to 0', () => {
      const state = reducer(stateWithIngredients, clearCounters());
      expect(state.ingredients.every((ing) => ing.count === 0)).toBe(true);
    });
  });
});
