import { combineReducers } from 'redux';
import gameReducer, { GameState } from './gameReducer';
import highlightReducer, { HighlightState } from './highlightReducer';
import mapReducer, { MapState } from './mapReducer';
import movementReducer, { MovementState } from './movementReducer';
import routeReducer, { RouteState } from './routeReducer';
import selectedTileReducer, { SelectedTileState } from './selectedTileReducer';
import selectedUnitReducer, { SelectedUnitState } from './selectedUnitReducer';
import unitReducer, { UnitState } from './unitReducer';
import updateReducer, { UpdateState } from './updateReducer';
import userReducer, { UserState } from './userReducer';

export interface RootState {
  user: UserState;
  map: MapState;
  movement: MovementState;
  highlight: HighlightState;
  selectedTile: SelectedTileState;
  selectedUnit: SelectedUnitState;
  units: UnitState;
  route: RouteState;
  game: GameState;
  update: UpdateState;
}

export default combineReducers<RootState>({
  user: userReducer,
  map: mapReducer,
  movement: movementReducer,
  highlight: highlightReducer,
  selectedTile: selectedTileReducer,
  selectedUnit: selectedUnitReducer,
  units: unitReducer,
  route: routeReducer,
  game: gameReducer,
  update: updateReducer,
});
