import { AnyAction } from 'redux';
import Unit from '../../data/Unit';
import { RESET, LOAD_MAP, UPDATE_UNIT } from '../actions';
import LoadMapAction from '../actions/loadMapAction';
import UpdateUnitAction from '../actions/updateUnitAction';

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
    case RESET: {
      return defaultState;
    }
    default: {
      return state;
    }
  }
};
