import { RootState } from '../store/reducers';
import { useContext, useEffect } from 'react';
import { StoreContext } from '../store/store';
import useCounter from './useCounter';
import usePrevious from './usePrevious';

type Selector<T> = (state: RootState) => T;

const useStore = <T>(selector: Selector<T>): T => {
  const store = useContext(StoreContext);
  const { subscribe, getState } = store;
  const forceUpdate = useCounter()[1];

  const value = selector(getState());

  const update = (): void => {
    const newValue = selector(getState());
    if (value !== newValue) {
      forceUpdate();
    }
  };

  const unsubscribeCurrent = subscribe(update);
  const unsubscribePrevious = usePrevious(unsubscribeCurrent);

  if (unsubscribePrevious) {
    unsubscribePrevious();
  }

  useEffect(() => unsubscribeCurrent);

  return value;
};

export default useStore;
