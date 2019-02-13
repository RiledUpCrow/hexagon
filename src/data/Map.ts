import Tile from './Tile';

export default interface Map {
  width: number;
  height: number;
  tiles: (Tile | null)[][];
}
