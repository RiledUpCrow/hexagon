import Position from './Position';
import { UnitType } from './UnitType';

export default interface Unit {
  id: number;
  type: UnitType;
  position: Position;
}
