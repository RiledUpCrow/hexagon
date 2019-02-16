import { combineReducers } from 'redux';
import selectedTileReducer, { SelectedTileState } from './selectedTileReducer';
import mapReducer, { MapState } from './mapReducer';

export interface RootState {
  map: MapState;
  selectedTile: SelectedTileState;
}

export default combineReducers<RootState>({
  map: mapReducer,
  selectedTile: selectedTileReducer,
});
