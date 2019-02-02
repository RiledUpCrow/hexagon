import Tile, { DefaultTile } from "./Tile";
import randomKey from "./randomKey";
import { groundFeatures } from "./GroundFeature";
import { groundTypes } from "./GroundType";

export default interface Map {
  width: number;
  height: number;
  tiles: (Tile | null)[][];
}

export class DefaultMap implements Map {
  public tiles: (Tile | null)[][] = [];

  constructor(public width: number, public height: number) {
    for (let xIndex = 0; xIndex < width; xIndex++) {
      this.tiles[xIndex] = [];
      for (let yIndex = 0; yIndex < height; yIndex++) {
        this.tiles[xIndex][yIndex] = new DefaultTile(
          randomKey(groundTypes),
          // "FLAT"
          randomKey(groundFeatures)
        );
      }
    }
  }
}
