import { GroundFeature } from '../data/GroundFeature';
import { GroundType } from '../data/GroundType';
import Map from '../data/Map';
import Tile from '../data/Tile';
import { DefaultTile } from './DefaultTile';
import { Side } from '../logic/atSide';

const groundTypes: GroundType[] = [
  'DESERT',
  'GRASSLAND',
  'MOUNTAIN',
  'PLAINS',
  'SNOW',
  'TUNDRA',
  'OCEAN',
];

export class DefaultMap implements Map {
  public tiles: Tile[][] = [];

  public constructor(public width: number, public height: number) {
    for (let xIndex = 0; xIndex < width; xIndex++) {
      this.tiles[xIndex] = [];
      for (let yIndex = 0; yIndex < height; yIndex++) {
        const type =
          groundTypes[Math.floor(Math.random() * groundTypes.length)];
        let feature: GroundFeature | null = null;
        if (type === 'GRASSLAND' || type === 'PLAINS') {
          feature = Math.random() > 0.5 ? 'FOREST' : null;
        }
        const hill =
          type !== 'OCEAN' && type !== 'MOUNTAIN' && Math.random() > 0.8;

        const sides: Side[] = ['SOUTH_EAST', 'SOUTH_WEST', 'WEST'];
        const chosenSides = sides.filter(() => Math.random() > 0.9);
        this.tiles[xIndex][yIndex] = new DefaultTile(
          type,
          hill,
          chosenSides,
          feature
        );
        if (Math.random() >= 0) {
          this.tiles[xIndex][yIndex].discovered = true;
          this.tiles[xIndex][yIndex].visible = Math.random() >= 0;
        }
      }
    }
  }
}
