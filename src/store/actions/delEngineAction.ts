import { Action } from 'redux';
import { ActionType } from '.';

export interface DelEngineAction extends Action<ActionType> {
  type: 'del_engine';
  engineId: string;
}
