import { Position } from '../userInterface/UnitInfo';

export default interface Highlight {
  id: number;
  tiles: Position[];
  color: number;
}
