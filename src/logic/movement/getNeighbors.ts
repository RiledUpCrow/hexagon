import { Position } from '../../userInterface/UnitInfo';
import atSide from '../atSide';

export default (position: Position, maxX: number, maxY: number): Position[] =>
  [
    atSide(position, 'NORTH_EAST'),
    atSide(position, 'EAST'),
    atSide(position, 'SOUTH_EAST'),
    atSide(position, 'SOUTH_WEST'),
    atSide(position, 'WEST'),
    atSide(position, 'NORTH_WEST'),
  ].filter(pos => pos.x >= 0 && pos.x < maxX && pos.y >= 0 && pos.y < maxY);
