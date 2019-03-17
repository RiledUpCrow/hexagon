import User from '../../data/User';
import { AnyAction } from 'redux';

export type UserState = User | null;

const defaultState: UserState = null;

const userReducer = (
  state: UserState = defaultState,
  action: AnyAction
): UserState => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};

export default userReducer;
