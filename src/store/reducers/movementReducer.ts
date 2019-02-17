import { AnyAction } from 'redux';
import Unit from '../../data/Unit';
import { Position } from '../../userInterface/TileInfo';
import { MOVE_UNIT, RESET } from '../actions';
import MoveUnitAction from '../actions/moveUnitAction';

export type MovementState = {
  unit: Unit;
  movement: Position[];
} | null;

const defaultState: MovementState = null;

export default (
  state: MovementState = defaultState,
  action: AnyAction
): MovementState => {
  switch (action.type) {
    case MOVE_UNIT: {
      const { unit, movement } = action as MoveUnitAction;
      return { unit, movement };
    }
    case RESET: {
      return defaultState;
    }
    default: {
      return state;
    }
  }
};
