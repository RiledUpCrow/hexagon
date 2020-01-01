import { ActionType } from '.';
import { Action } from 'redux';
import Engine from '../../data/Engine';
import Game from '../../data/Game';

export interface AddEngineAction extends Action<ActionType> {
  type: 'add_engine';
  engine: Engine;
  games: Game[];
}
