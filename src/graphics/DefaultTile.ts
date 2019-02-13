import { GroundFeature } from '../data/GroundFeature';
import { GroundType } from '../data/GroundType';
import Tile from '../data/Tile';

export class DefaultTile implements Tile {
  public constructor(
    public groundType: GroundType,
    public groundFeature: GroundFeature | null = null
  ) {}
}
