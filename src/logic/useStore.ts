import { RootState } from '../store/reducers';
import { useContext, useEffect } from 'react';
import { StoreContext } from '../store/store';
import useCounter from './useCounter';

type Selector<T> = (state: RootState) => T;

const useStore = <T>(selector: Selector<T>): T => {
  const store = useContext(StoreContext);
  const update = useCounter()[1];
  const currentValue = selector(store.getState());

  useEffect(() =>
    store.subscribe(() => {
      const updatedValue = selector(store.getState());
      if (updatedValue !== currentValue) {
        update();
      }
    })
  );

  return currentValue;
};

export default useStore;
