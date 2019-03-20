import { ActionType } from '.';
import { Action } from 'redux';

export interface BackAction extends Action<ActionType> {
  type: 'back';
}
