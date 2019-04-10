import { Action } from 'redux';
import { ActionType } from '.';

export interface DelGameAction extends Action<ActionType> {
  type: 'del_game';
  gameId: string;
  engineId: string;
}
