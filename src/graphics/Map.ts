import Tile, { DefaultTile } from "./Tile";
import randomKey from "./randomKey";
import TextureManager from "./TextureManager";

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
          Math.random() >= 0
            ? new DefaultTile(
                randomKey(TextureManager.groundTypes),
                randomKey(TextureManager.groundFeatures)
              )
            : null;
      }
    }
  }
}
