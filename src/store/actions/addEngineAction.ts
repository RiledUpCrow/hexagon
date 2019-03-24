import { ActionType } from '.';
import { Action } from 'redux';
import Engine from '../../data/Engine';

export interface AddEngineAction extends Action<ActionType> {
  type: 'add_engine';
  engine: Engine;
}
