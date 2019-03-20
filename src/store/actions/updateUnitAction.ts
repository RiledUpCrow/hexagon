import { Action } from 'redux';
import { ActionType } from '.';
import Unit from '../../data/Unit';

export default interface UpdateUnitAction extends Action<ActionType> {
  type: 'update_unit';
  unit: Unit;
}
