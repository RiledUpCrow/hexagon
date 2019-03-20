import Unit from '../../data/Unit';
import { GameAction } from '../actions';

export interface UnitState {
  [id: number]: Unit;
}

const defaultState: UnitState = {};

export default (
  state: UnitState = defaultState,
  action: GameAction
): UnitState => {
  switch (action.type) {
    case 'load_map': {
      const { units } = action;
      const result: UnitState = {};
      units.forEach(unit => {
        result[unit.id] = unit;
      });
      return result;
    }
    case 'update_unit': {
      const { unit } = action;
      return {
        ...state,
        [unit.id]: { ...unit },
      };
    }
    case 'move_unit': {
      const { unit, movement } = action;
      return {
        ...state,
        [unit.id]: { ...unit, position: movement[movement.length - 1] },
      };
    }
    case 'reset': {
      return defaultState;
    }
    default: {
      return state;
    }
  }
};
