export default interface Tile {
  color: number;
  x: number;
  y: number;
}

export class DefaultTile implements Tile {
  constructor(public color: number, public x: number, public y: number) {}
}
