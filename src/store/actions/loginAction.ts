import { Action } from 'redux';
import { ActionType } from '.';
import User from '../../data/User';

export default interface LoginAction extends Action<ActionType> {
  type: 'login';
  user: User;
}
