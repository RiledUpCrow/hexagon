import { combineReducers } from 'redux';
import selectedTileReducer, { SelectedTileState } from './selectedTileReducer';
import mapReducer, { MapState } from './mapReducer';
import unitReducer, { UnitState } from './unitReducer';
import selectedUnitReducer, { SelectedUnitState } from './selectedUnitReducer';
import movementReducer, { MovementState } from './movementReducer';
import highlightReducer, { HighlightState } from './highlightReducer';
import userReducer, { UserState } from './userReducer';

export interface RootState {
  user: UserState;
  map: MapState;
  movement: MovementState;
  highlight: HighlightState;
  selectedTile: SelectedTileState;
  selectedUnit: SelectedUnitState;
  units: UnitState;
}

export default combineReducers<RootState>({
  user: userReducer,
  map: mapReducer,
  movement: movementReducer,
  highlight: highlightReducer,
  selectedTile: selectedTileReducer,
  selectedUnit: selectedUnitReducer,
  units: unitReducer,
});
