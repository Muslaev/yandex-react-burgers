import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearIngredients,
} from './burger-constructor';

import type { ConstructorState, TIngredientWithCounter } from '@/utils/types';

const mockBun: TIngredientWithCounter = {
  _id: 'bun1',
  name: 'Краторная булка',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 150,
  calories: 420,
  price: 1255,
  image: 'bun.jpg',
  image_large: 'bun_large.jpg',
  image_mobile: 'bun_mobile.jpg',
  __v: 0,
  count: 0,
};

const mockSauce: TIngredientWithCounter = {
  _id: 'sauce1',
  name: 'Соус фирменный',
  type: 'sauce',
  proteins: 50,
  fat: 20,
  carbohydrates: 10,
  calories: 100,
  price: 50,
  image: 'sauce.jpg',
  image_large: 'sauce_large.jpg',
  image_mobile: 'sauce_mobile.jpg',
  __v: 0,
  count: 1,
};

const mockMain: TIngredientWithCounter = {
  _id: 'main1',
  name: 'Мясо',
  type: 'main',
  proteins: 100,
  fat: 30,
  carbohydrates: 5,
  calories: 200,
  price: 300,
  image: 'main.jpg',
  image_large: 'main_large.jpg',
  image_mobile: 'main_mobile.jpg',
  __v: 0,
  count: 1,
};

describe('burgerConstructor slice', () => {
  const initialState: ConstructorState = {
    bun: null,
    constructorIngredients: [],
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('addIngredient', () => {
    it('should add bun and replace existing bun', () => {
      const state1 = reducer(initialState, addIngredient(mockBun));
      expect(state1.bun?._id).toBe('bun1');
      expect(state1.bun?.type).toBe('bun');
      expect(state1.constructorIngredients).toHaveLength(0);

      const newBun = { ...mockBun, _id: 'bun2' };
      const state2 = reducer(state1, addIngredient(newBun));
      expect(state2.bun?._id).toBe('bun2');
      expect(state2.constructorIngredients).toHaveLength(0);
    });

    it('should add non-bun ingredient', () => {
      const state = reducer(initialState, addIngredient(mockSauce));
      expect(state.constructorIngredients).toHaveLength(1);
      expect(state.constructorIngredients[0]._id).toBe('sauce1');
      expect(state.bun).toBeNull();
    });

    it('should add multiple non-bun ingredients', () => {
      let state = reducer(initialState, addIngredient(mockSauce));
      state = reducer(state, addIngredient(mockMain));
      expect(state.constructorIngredients).toHaveLength(2);
      expect(state.constructorIngredients.map((i) => i._id)).toEqual([
        'sauce1',
        'main1',
      ]);
    });
  });

  describe('removeIngredient', () => {
    it('should remove ingredient by key', () => {
      let state = reducer(initialState, addIngredient(mockSauce));
      state = reducer(state, addIngredient(mockMain));
      const keyToRemove = state.constructorIngredients[0].key;

      const newState = reducer(state, removeIngredient(keyToRemove));
      expect(newState.constructorIngredients).toHaveLength(1);
      expect(newState.constructorIngredients[0]._id).toBe('main1');
    });
  });

  describe('moveIngredient', () => {
    it('should move ingredient from index to index', () => {
      let state = reducer(initialState, addIngredient(mockSauce));
      state = reducer(state, addIngredient(mockMain));

      const key1 = state.constructorIngredients[0].key;
      const key2 = state.constructorIngredients[1].key;

      const moved = reducer(state, moveIngredient({ fromIndex: 0, toIndex: 1 }));

      expect(moved.constructorIngredients[0].key).toBe(key2);
      expect(moved.constructorIngredients[1].key).toBe(key1);
    });

    it('should not change if indices invalid', () => {
      const state = {
        bun: null,
        constructorIngredients: [{ ...mockSauce, key: 'k1' }],
      } as ConstructorState;

      const result = reducer(state, moveIngredient({ fromIndex: 5, toIndex: 10 }));
      expect(result).toEqual(state);
    });
  });

  describe('clearIngredients', () => {
    it('should clear all ingredients and bun', () => {
      let state = reducer(initialState, addIngredient(mockBun));
      state = reducer(state, addIngredient(mockSauce));

      const cleared = reducer(state, clearIngredients());
      expect(cleared).toEqual(initialState);
    });
  });
});
