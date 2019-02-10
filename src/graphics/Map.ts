import Tile, { DefaultTile } from './Tile';
import randomKey from './randomKey';
import TextureManager from './TextureManager';
import { GroundFeature } from './GroundFeature';

export default interface Map {
  width: number;
  height: number;
  tiles: (Tile | null)[][];
}

export class DefaultMap implements Map {
  public tiles: (Tile | null)[][] = [];

  public constructor(public width: number, public height: number) {
    for (let xIndex = 0; xIndex < width; xIndex++) {
      this.tiles[xIndex] = [];
      for (let yIndex = 0; yIndex < height; yIndex++) {
        const type = randomKey(TextureManager.groundTypes);
        let feature: GroundFeature | null = null;
        if (
          type === 'GRASSLAND' ||
          type === 'GRASS_HILL' ||
          type === 'PLAINS'
        ) {
          feature = randomKey(TextureManager.groundFeatures);
        }
        this.tiles[xIndex][yIndex] =
          Math.random() >= 0.2 ? new DefaultTile(type, feature) : null;
      }
    }
  }
}
