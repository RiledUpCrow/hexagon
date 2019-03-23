import { GameAction } from '../actions';

export type UpdateState = boolean;

const defaultState: UpdateState = false;

export default (
  state: UpdateState = defaultState,
  action: GameAction
): UpdateState => {
  switch (action.type) {
    case 'update': {
      return true;
    }
    default: {
      return state;
    }
  }
};
