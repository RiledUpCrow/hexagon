import { ActionType } from '.';
import { Action } from 'redux';
import Game from '../../data/Game';

export interface AddGameAction extends Action<ActionType> {
  type: 'add_game';
  game: Game;
  engineId: string;
}
