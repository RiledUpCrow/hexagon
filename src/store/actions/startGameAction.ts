import { ActionType } from '.';
import { Action } from 'redux';
import GameData from '../../data/GameData';

export default interface StartGameAction extends Action<ActionType> {
  type: 'start_game';
  gameData: GameData;
}
