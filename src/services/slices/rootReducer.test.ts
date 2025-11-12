import { store } from '..';
import constructorReducer from './burger-constructor';
import feedReducer from './feed';
import ingredientsReducer from './ingredients';
import orderReducer from './order';
import orderDetailsReducer from './order-details';
import userReducer from './user';
import userFeedReducer from './user-feed';

describe('rootReducer', () => {
  it('should return correct state @@INIT', () => {
    const initialState = store.getState();

    expect(initialState).toEqual({
      ingredients: ingredientsReducer(undefined, { type: '@@INIT' }),
      burgerConstructor: constructorReducer(undefined, { type: '@@INIT' }),
      order: orderReducer(undefined, { type: '@@INIT' }),
      user: userReducer(undefined, { type: '@@INIT' }),
      feed: feedReducer(undefined, { type: '@@INIT' }),
      userFeed: userFeedReducer(undefined, { type: '@@INIT' }),
      orderDetails: orderDetailsReducer(undefined, { type: '@@INIT' }),
    });
  });

  it('should return current state after unknown action', () => {
    const prevState = store.getState();
    store.dispatch({ type: 'UNKNOWN_ACTION' });
    const newState = store.getState();
    expect(newState).toBe(prevState);
  });
});
