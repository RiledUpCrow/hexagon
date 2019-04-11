import { Action } from 'redux';
import { ActionType } from '.';
import Engine from '../../data/Engine';

export interface RenameEngineAction extends Action<ActionType> {
  type: 'rename_engine';
  engine: Engine;
  name: string;
}
