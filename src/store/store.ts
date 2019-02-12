import { createStore } from 'redux';
import reducer from './reducers';
import { createContext } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
const store = createStore(
  reducer,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);
/* eslint-enable @typescript-eslint/no-explicit-any */

export const StoreContext = createContext(store);

export default store;
