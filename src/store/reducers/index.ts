import { combineReducers } from 'redux';
import selectedTileReducer, { SelectedTileState } from './selectedTileReducer';
import mapReducer, { MapState } from './mapReducer';
import unitReducer, { UnitState } from './unitReducer';
import selectedUnitReducer, { SelectedUnitState } from './selectedUnitReducer';
import movementReducer, { MovementState } from './movementReducer';

export interface RootState {
  map: MapState;
  movement: MovementState;
  selectedTile: SelectedTileState;
  selectedUnit: SelectedUnitState;
  units: UnitState;
}

export default combineReducers<RootState>({
  map: mapReducer,
  movement: movementReducer,
  selectedTile: selectedTileReducer,
  selectedUnit: selectedUnitReducer,
  units: unitReducer,
});
