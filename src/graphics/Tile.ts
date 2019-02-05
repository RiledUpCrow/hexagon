import { GroundFeature } from './GroundFeature';
import { GroundType } from './GroundType';

export default interface Tile {
  groundType: GroundType;
  groundFeature: GroundFeature;
}

export class DefaultTile implements Tile {
  constructor(
    public groundType: GroundType,
    public groundFeature: GroundFeature = 'FLAT'
  ) {}
}
