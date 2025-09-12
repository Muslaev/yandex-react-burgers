import { store } from '@store/index';
import { useDispatch } from 'react-redux';

declare module 'react-redux' {
  interface DefaultRootState extends ReturnType<typeof store.getState> {}
  export function useDispatch<TDispatch = typeof store.dispatch>(): TDispatch;
}
