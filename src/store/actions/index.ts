import { AddEngineAction } from './addEngineAction';
import { AddGameAction } from './addGameAction';
import { BackAction } from './backAction';
import { DelEngineAction } from './delEngineAction';
import { DeselectAction } from './deselectAction';
import LoadMapAction from './loadMapAction';
import LoginAction from './loginAction';
import LogoutAction from './logoutAction';
import MoveUnitAction from './moveUnitAction';
import { NavigateAction } from './navigateAction';
import { RenameGameAction } from './renameGameAction';
import { ResetAction } from './resetAction';
import { SelectTileAction } from './selectTileAction';
import SelectUnitAction from './selectUnitAction';
import StartGameAction from './startGameAction';
import UpdateAction from './updateAction';
import UpdateTileAction from './updateTileAction';
import UpdateUnitAction from './updateUnitAction';
import { RefreshDataAction } from './refreshDataAction';
import { DelGameAction } from './delGameAction';

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
  | 'logout'
  | 'update'
  | 'add_engine'
  | 'del_engine'
  | 'add_game'
  | 'rename_game'
  | 'refresh_data'
  | 'del_game';

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
  | LogoutAction
  | UpdateAction
  | AddEngineAction
  | DelEngineAction
  | AddGameAction
  | RenameGameAction
  | RefreshDataAction
  | DelGameAction;
