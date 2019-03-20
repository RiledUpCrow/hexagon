import { Action } from 'redux';
import { ActionType } from '.';
import Unit from '../../data/Unit';
import { Position } from '../../userInterface/TileInfo';

export default interface MoveUnitAction extends Action<ActionType> {
  type: 'move_unit';
  unit: Unit;
  movement: Position[];
}
