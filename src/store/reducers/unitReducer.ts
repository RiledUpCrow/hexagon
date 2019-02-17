import { AnyAction } from 'redux';
import Unit from '../../data/Unit';
import { RESET, LOAD_MAP } from '../actions';
import LoadMapAction from '../actions/loadMapAction';

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
    case RESET: {
      return defaultState;
    }
    default: {
      return state;
    }
  }
};
