import { BackAction } from './backAction';
import { DeselectAction } from './deselectAction';
import LoadMapAction from './loadMapAction';
import MoveUnitAction from './moveUnitAction';
import { NavigateAction } from './navigateAction';
import { ResetAction } from './resetAction';
import { SelectTileAction } from './selectTileAction';
import SelectUnitAction from './selectUnitAction';
import UpdateTileAction from './updateTileAction';
import UpdateUnitAction from './updateUnitAction';
import StartGameAction from './startGameAction';
import LoginAction from './loginAction';
import LogoutAction from './logoutAction';

export type ActionType =
  | 'reset'
  | 'select_tile'
  | 'select_unit'
  | 'load_map'
  | 'update_tile'
  | 'update_unit'
  | 'move_unit'
  | 'deselect'
  | 'navigate'
  | 'back'
  | 'start_game'
  | 'login'
  | 'logout';

export type GameAction =
  | ResetAction
  | LoadMapAction
  | MoveUnitAction
  | SelectTileAction
  | SelectUnitAction
  | UpdateTileAction
  | UpdateUnitAction
  | DeselectAction
  | NavigateAction
  | BackAction
  | StartGameAction
  | LoginAction
  | LogoutAction;
