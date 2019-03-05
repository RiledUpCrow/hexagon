import { Position } from '../../userInterface/UnitInfo';

export default interface Pathfinder {
  getPath: (target: Position) => Position[];
}
