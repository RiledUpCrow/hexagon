import { Action } from 'redux';
import { ActionType } from '.';
import Engine from '../../data/Engine';
import Game from '../../data/Game';

export interface RefreshDataAction extends Action<ActionType> {
  type: 'refresh_data';
  engines: Engine[];
  games: Game[];
}
