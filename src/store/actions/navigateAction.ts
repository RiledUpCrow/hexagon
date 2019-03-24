import { Action } from 'redux';
import { ActionType } from '.';
import { View } from '../../data/View';

export interface NavigateAction extends Action<ActionType> {
  type: 'navigate';
  view: View;
  param?: string;
}
