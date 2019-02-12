import { Position } from '../../userInterface/TileInfo';
import Tile from '../../graphics/Tile';
import { AnyAction } from 'redux';
import { SELECT_TILE, RESET } from '../actions';
import { SelectTileAction } from '../actions/selectTileAction';

export type SelectedTileState = {
  position: Position;
  tile: Tile;
} | null;

const defaultState = null;

export default (
  state: SelectedTileState = defaultState,
  action: AnyAction
): SelectedTileState => {
  switch (action.type) {
    case SELECT_TILE: {
      const { tile, position } = action as SelectTileAction;
      return { tile, position };
    }
    case RESET: {
      return defaultState;
    }
    default:
      return state;
  }
};
