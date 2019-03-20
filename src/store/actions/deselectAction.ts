import { Action } from 'redux';
import { ActionType } from '.';

export interface DeselectAction extends Action<ActionType> {
  type: 'deselect';
}
