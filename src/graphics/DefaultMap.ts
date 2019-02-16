import { DefaultTile } from './DefaultTile';
import randomKey from '../logic/randomKey';
import TextureManager from './TextureManager';
import { GroundFeature } from '../data/GroundFeature';
import Map from '../data/Map';
import Tile from '../data/Tile';

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
          feature =
            Math.random() > 0.5
              ? randomKey(TextureManager.groundFeatures)
              : null;
        }
        this.tiles[xIndex][yIndex] =
          Math.random() >= 0 ? new DefaultTile(type, feature) : null;
      }
    }
  }
}
