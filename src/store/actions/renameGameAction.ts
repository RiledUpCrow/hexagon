import { Action } from 'redux';
import { ActionType } from '.';
import Game from '../../data/Game';

export interface RenameGameAction extends Action<ActionType> {
  type: 'rename_game';
  game: Game;
  name: string;
}
