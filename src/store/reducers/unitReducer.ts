import { AnyAction } from 'redux';
import Unit from '../../data/Unit';
import { RESET, LOAD_MAP, UPDATE_UNIT, MOVE_UNIT } from '../actions';
import LoadMapAction from '../actions/loadMapAction';
import UpdateUnitAction from '../actions/updateUnitAction';
import MoveUnitAction from '../actions/moveUnitAction';

export interface UnitState {
  [id: number]: Unit;
}

const defaultState: UnitState = {};

export default (
  state: UnitState = defaultState,
  action: AnyAction
): UnitState => {
  switch (action.type) {
    case LOAD_MAP: {
      const { units } = action as LoadMapAction;
      const result: UnitState = {};
      units.forEach(unit => {
        result[unit.id] = unit;
      });
      return result;
    }
    case UPDATE_UNIT: {
      const { unit } = action as UpdateUnitAction;
      return {
        ...state,
        [unit.id]: { ...unit },
      };
    }
    case MOVE_UNIT: {
      const { unit, movement } = action as MoveUnitAction;
      return {
        ...state,
        [unit.id]: { ...unit, position: movement[movement.length - 1] },
      };
    }
    case RESET: {
      return defaultState;
    }
    default: {
      return state;
    }
  }
};
