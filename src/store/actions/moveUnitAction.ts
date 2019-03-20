import { Action } from 'redux';
import { ActionType } from '.';
import Position from '../../data/Position';
import Unit from '../../data/Unit';

export default interface MoveUnitAction extends Action<ActionType> {
  type: 'move_unit';
  unit: Unit;
  movement: Position[];
}
