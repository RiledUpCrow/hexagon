import { Action } from 'redux';
import { ActionType } from '.';
import Unit from '../../data/Unit';

export default interface SelectUnitAction extends Action<ActionType> {
  type: 'select_unit';
  unit: Unit;
}
