import Unit from '../../data/Unit';
import { Position } from '../../userInterface/TileInfo';
import { GameAction } from '../actions';

export type MovementState = {
  unit: Unit;
  movement: Position[];
} | null;

const defaultState: MovementState = null;

export default (
  state: MovementState = defaultState,
  action: GameAction
): MovementState => {
  switch (action.type) {
    case 'move_unit': {
      const { unit, movement } = action;
      return { unit, movement };
    }
    case 'reset': {
      return defaultState;
    }
    default: {
      return state;
    }
  }
};
