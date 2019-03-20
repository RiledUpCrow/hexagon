import Map from '../../data/Map';
import Tile from '../../data/Tile';
import { GameAction } from '../actions';

type Tiles = Tile[][];

const updateMap = (tiles: Tiles, x: number, y: number, tile: Tile): Tiles => {
  const newTiles = tiles.map(col => [...col]);
  newTiles[x][y] = tile;
  return newTiles;
};

export type MapState = Map | null;

const defaultState = null;

export default (
  state: MapState = defaultState,
  action: GameAction
): MapState => {
  switch (action.type) {
    case 'load_map': {
      const { map } = action;
      return map;
    }
    case 'update_tile': {
      const { x, y, tile } = action;
      if (!state) {
        // this is a no-op, but let's have a warning
        console.log('Update of a non-existing map - bug?'); // eslint-disable-line no-console
        return state;
      }
      const tiles = updateMap(state.tiles, x, y, tile);
      return { ...state, tiles };
    }
    case 'reset': {
      return defaultState;
    }
    default:
      return state;
  }
};
