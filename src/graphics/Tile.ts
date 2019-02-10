import { GroundFeature } from './GroundFeature';
import { GroundType } from './GroundType';

export default interface Tile {
  groundType: GroundType;
  groundFeature: GroundFeature | null;
}

export class DefaultTile implements Tile {
  public constructor(
    public groundType: GroundType,
    public groundFeature: GroundFeature | null = null
  ) {}
}
