import { GroundFeature } from '../data/GroundFeature';
import { GroundType } from '../data/GroundType';
import Map from '../data/Map';
import Tile from '../data/Tile';
import { DefaultTile } from './DefaultTile';

const groundTypes: GroundType[] = [
  'DESERT',
  'GRASSLAND',
  'GRASS_HILL',
  'MOUNTAIN',
  'PLAINS',
  'SNOW',
  'TUNDRA',
  'WATER',
];

export class DefaultMap implements Map {
  public tiles: (Tile | null)[][] = [];

  public constructor(public width: number, public height: number) {
    for (let xIndex = 0; xIndex < width; xIndex++) {
      this.tiles[xIndex] = [];
      for (let yIndex = 0; yIndex < height; yIndex++) {
        const type =
          groundTypes[Math.floor(Math.random() * groundTypes.length)];
        let feature: GroundFeature | null = null;
        if (
          type === 'GRASSLAND' ||
          type === 'GRASS_HILL' ||
          type === 'PLAINS'
        ) {
          feature = Math.random() > 0.5 ? 'FOREST' : null;
        }
        this.tiles[xIndex][yIndex] =
          Math.random() >= 0 ? new DefaultTile(type, feature) : null;
      }
    }
  }
}
