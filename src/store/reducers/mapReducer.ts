import { AnyAction } from 'redux';
import Map from '../../data/Map';
import { LOAD_MAP, RESET, UPDATE_TILE } from '../actions';
import LoadMapAction from '../actions/loadMapAction';
import UpdateTileAction from '../actions/updateTileAction';

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
      const oldTiles = state.tiles;
      const newTiles = [
        ...oldTiles.slice(0, x),
        [...oldTiles[x].slice(0, y), tile, ...oldTiles[x].slice(y + 1)],
        ...oldTiles.slice(x + 1),
      ];

      return {
        ...state,
        tiles: newTiles,
      };
    }
    case RESET: {
      return defaultState;
    }
    default:
      return state;
  }
};
