import { combineReducers } from 'redux';
import selectedTileReducer, { SelectedTileState } from './selectedTileReducer';
import mapReducer, { MapState } from './mapReducer';
import unitReducer, { UnitState } from './unitReducer';
import selectedUnitReducer, { SelectedUnitState } from './selectedUnitReducer';

export interface RootState {
  map: MapState;
  selectedTile: SelectedTileState;
  selectedUnit: SelectedUnitState;
  units: UnitState;
}

export default combineReducers<RootState>({
  map: mapReducer,
  selectedTile: selectedTileReducer,
  selectedUnit: selectedUnitReducer,
  units: unitReducer,
});
