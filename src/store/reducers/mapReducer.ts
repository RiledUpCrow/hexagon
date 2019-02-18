import { AnyAction } from 'redux';
import Map from '../../data/Map';
import Tile from '../../data/Tile';
import { LOAD_MAP, RESET, UPDATE_TILE } from '../actions';
import LoadMapAction from '../actions/loadMapAction';
import UpdateTileAction from '../actions/updateTileAction';

type Tiles = (Tile | null)[][];

const updateMap = (tiles: Tiles, x: number, y: number, tile: Tile): Tiles => {
  const newTiles = tiles.map(col => [...col]);
  newTiles[x][y] = tile;
  return newTiles;
};

export type MapState = Map | null;

const defaultState = null;

export default (
  state: MapState = defaultState,
  action: AnyAction
): MapState => {
  switch (action.type) {
    case LOAD_MAP: {
      const { map } = action as LoadMapAction;
      return map;
    }
    case UPDATE_TILE: {
      const { x, y, tile } = action as UpdateTileAction;
      if (!state) {
        // this is a no-op, but let's have a warning
        console.log('Update of a non-existing map - bug?'); // eslint-disable-line no-console
        return state;
      }
      const tiles = updateMap(state.tiles, x, y, tile);
      return { ...state, tiles };
    }
    case RESET: {
      return defaultState;
    }
    default:
      return state;
  }
};
