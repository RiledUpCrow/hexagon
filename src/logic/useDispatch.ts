import { useContext } from 'react';
import { StoreContext } from '../store/store';

export default () => {
  return useContext(StoreContext).dispatch;
};
