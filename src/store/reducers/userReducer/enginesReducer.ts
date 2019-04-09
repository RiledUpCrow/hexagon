import Engine from '../../../data/Engine';
import { GameAction } from '../../actions';

export type EnginesState = Engine[];

const defaultState: EnginesState = [];

export default (
  state: EnginesState = defaultState,
  action: GameAction
): EnginesState => {
  switch (action.type) {
    case 'refresh_data': {
      const { engines } = action;
      return engines;
    }
    case 'add_engine': {
      if (!state) {
        return state;
      }
      const { engine } = action;
      return [...state, engine];
    }
    case 'del_engine': {
      if (!state) {
        return state;
      }
      const { engineId } = action;
      const index = state.findIndex(e => e.id === engineId);
      if (index < 0) {
        return state;
      }
      const newState = [...state];
      newState.splice(index, 1);
      return newState;
    }
    default:
      return state;
  }
};
