import User from '../../data/User';
import { GameAction } from '../actions';

export type UserState = User | null;

const defaultState: UserState = null;

const userReducer = (
  state: UserState = defaultState,
  action: GameAction
): UserState => {
  switch (action.type) {
    case 'login': {
      const { user } = action;
      return user;
    }
    case 'logout': {
      return defaultState;
    }
    default: {
      return state;
    }
  }
};

export default userReducer;
