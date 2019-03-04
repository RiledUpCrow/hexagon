import { Position } from '../userInterface/TileInfo';

const toCube = (pos: Position): [number, number, number] => {
  const x = pos.x - (pos.y - (pos.y & 1)) / 2;
  const z = pos.y;
  const y = -x - z;
  return [x, y, z];
};

/**
 * Calculates the Manhattan distance between tiles on a hex grid. It does that
 * by converting the regular grid coordinates to a cube coordinates and then
 * calculating Manhattan distance between those points in the cube.
 */
export default (a: Position, b: Position): number => {
  const [ax, ay, az] = toCube(a);
  const [bx, by, bz] = toCube(b);
  return (Math.abs(ax - bx) + Math.abs(ay - by) + Math.abs(az - bz)) / 2;
};
