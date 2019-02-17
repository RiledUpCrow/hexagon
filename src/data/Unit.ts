import { UnitType } from './UnitType';
import { Position } from '../userInterface/TileInfo';

export default interface Unit {
  id: number;
  type: UnitType;
  position: Position;
}
