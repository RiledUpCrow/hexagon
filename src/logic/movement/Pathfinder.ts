import Position from '../../data/Position';

export default interface Pathfinder {
  getPath: (target: Position) => Position[];
}
