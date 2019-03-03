import Tile from './Tile';

export default interface Map {
  /**
   * Length of the root array in `tiles`.
   */
  width: number;
  /**
   * Height of the child arrays in `tiles`.
   */
  height: number;
  /**
   * 2D array of tiles where the root array is X coordinate (from left to right)
   * and represents columns. Child arrays are Y coordinate (from top do bottom)
   * and represent rows.
   */
  tiles: Tile[][];
}
