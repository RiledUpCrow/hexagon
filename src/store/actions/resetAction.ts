import { Action } from 'redux';
import { ActionType } from '.';

export interface ResetAction extends Action<ActionType> {
  type: 'reset';
}
