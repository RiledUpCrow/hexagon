import { AnyAction } from 'redux';
import Unit from '../../data/Unit';
import { RESET, SELECT_UNIT, UPDATE_UNIT, MOVE_UNIT } from '../actions';
import SelectUnitAction from '../actions/selectUnitAction';
import UpdateUnitAction from '../actions/updateUnitAction';
import MoveUnitAction from '../actions/moveUnitAction';

export type SelectedUnitState = Unit | null;

const defaultState = null;

export default (
  state: SelectedUnitState = defaultState,
  action: AnyAction
): SelectedUnitState => {
  switch (action.type) {
    case SELECT_UNIT: {
      const { unit } = action as SelectUnitAction;
      return unit;
    }
    case UPDATE_UNIT: {
      const { unit } = action as UpdateUnitAction;
      if (state && state.id === unit.id) {
        return unit;
      }
      return state;
    }
    case MOVE_UNIT: {
      const { unit, movement } = action as MoveUnitAction;
      if (state && state.id === unit.id) {
        return { ...unit, position: movement[movement.length - 1] };
      }
      return state;
    }
    case RESET: {
      return defaultState;
    }
    default:
      return state;
  }
};
