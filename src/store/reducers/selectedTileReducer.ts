import Position from '../../data/Position';
import Tile from '../../data/Tile';
import { GameAction } from '../actions';

export type SelectedTileState = {
  position: Position;
  tile: Tile;
} | null;

const defaultState = null;

export default (
  state: SelectedTileState = defaultState,
  action: GameAction
): SelectedTileState => {
  switch (action.type) {
    case 'select_tile': {
      const { tile, position } = action;
      return { tile, position };
    }
    case 'deselect':
    case 'reset': {
      return defaultState;
    }
    default:
      return state;
  }
};
