import { Action } from 'redux';
import { ActionType } from '.';

export default interface LogoutAction extends Action<ActionType> {
  type: 'logout';
}
