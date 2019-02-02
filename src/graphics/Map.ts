import Tile, { DefaultTile } from "./Tile";
import randomKey from "./randomKey";
import { groundFeatures } from "./GroundFeature";

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
        this.tiles[xIndex][yIndex] =
          Math.random() >= 0.25
            ? new DefaultTile(
                Math.floor((Math.random() * 0.5 + 0.25) * 256 * 256 * 256),
                randomKey(groundFeatures)
              )
            : null;
      }
    }
  }
}
