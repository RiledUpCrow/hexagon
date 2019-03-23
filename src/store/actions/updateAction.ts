import { Action } from 'redux';
import { ActionType } from '.';

export default interface UpdateAction extends Action<ActionType> {
  type: 'update';
}
