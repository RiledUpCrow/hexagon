import { AnyAction } from 'redux';
import Unit from '../../data/Unit';
import { Position } from '../../userInterface/TileInfo';

export default interface MoveUnitAction extends AnyAction {
  unit: Unit;
  movement: Position[];
}
