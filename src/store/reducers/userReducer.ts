import User from '../../data/User';
import { GameAction } from '../actions';

export type UserState = User | null;

const defaultState: UserState = null;

const userReducer = (
  state: UserState = defaultState,
  action: GameAction
): UserState => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};

export default userReducer;
