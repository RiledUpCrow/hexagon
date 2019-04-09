import User from '../../../data/User';
import { GameAction } from '../../actions';

export type ProfileState = User | null;

const defaultState: ProfileState = null;

const profileReducer = (
  state: ProfileState = defaultState,
  action: GameAction
): ProfileState => {
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

export default profileReducer;
