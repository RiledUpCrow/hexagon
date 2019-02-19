import { Position } from '../../userInterface/TileInfo';
import { AnyAction } from 'redux';
import { SELECT_TILE, RESET, DESELECT } from '../actions';
import { SelectTileAction } from '../actions/selectTileAction';
import Tile from '../../data/Tile';

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
    case DESELECT:
    case RESET: {
      return defaultState;
    }
    default:
      return state;
  }
};
