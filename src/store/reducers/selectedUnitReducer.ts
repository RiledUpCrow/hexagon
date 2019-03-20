import Unit from '../../data/Unit';
import { GameAction } from '../actions';

export type SelectedUnitState = Unit | null;

const defaultState = null;

export default (
  state: SelectedUnitState = defaultState,
  action: GameAction
): SelectedUnitState => {
  switch (action.type) {
    case 'select_unit': {
      const { unit } = action;
      return unit;
    }
    case 'update_unit': {
      const { unit } = action;
      if (state && state.id === unit.id) {
        return unit;
      }
      return state;
    }
    case 'move_unit': {
      const { unit, movement } = action;
      if (state && state.id === unit.id) {
        return { ...unit, position: movement[movement.length - 1] };
      }
      return state;
    }
    case 'deselect':
    case 'reset': {
      return defaultState;
    }
    default:
      return state;
  }
};
