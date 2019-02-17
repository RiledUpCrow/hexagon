import { combineReducers } from 'redux';
import selectedTileReducer, { SelectedTileState } from './selectedTileReducer';
import mapReducer, { MapState } from './mapReducer';
import unitReducer, { UnitState } from './unitReducer';

export interface RootState {
  map: MapState;
  selectedTile: SelectedTileState;
  units: UnitState;
}

export default combineReducers<RootState>({
  map: mapReducer,
  selectedTile: selectedTileReducer,
  units: unitReducer,
});
