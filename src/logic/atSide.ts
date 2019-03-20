import Position from '../data/Position';
import Vector from '../graphics/Vector';

export type Side =
  | 'NORTH_WEST'
  | 'NORTH_EAST'
  | 'EAST'
  | 'SOUTH_EAST'
  | 'SOUTH_WEST'
  | 'WEST';

const odd: { [K in Side]: Vector } = {
  NORTH_WEST: new Vector(0, -1),
  NORTH_EAST: new Vector(1, -1),
  EAST: new Vector(1, 0),
  SOUTH_EAST: new Vector(1, 1),
  SOUTH_WEST: new Vector(0, 1),
  WEST: new Vector(-1, 0),
};

const even: { [K in Side]: Vector } = {
  NORTH_WEST: new Vector(-1, -1),
  NORTH_EAST: new Vector(0, -1),
  EAST: new Vector(1, 0),
  SOUTH_EAST: new Vector(0, 1),
  SOUTH_WEST: new Vector(-1, 1),
  WEST: new Vector(-1, 0),
};

export default (position: Position, side: Side) => {
  const { x, y } = position;
  const { x: tX, y: tY } = (y % 2 === 0 ? even : odd)[side];
  return { x: x + tX, y: y + tY };
};
