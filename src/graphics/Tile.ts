export default interface Tile {
  color: number;
  groundFeature: GroundFeature;
}

export enum GroundFeature {
  FLAT,
  HILL
}

export class DefaultTile implements Tile {
  constructor(
    public color: number,
    public groundFeature: GroundFeature = GroundFeature.FLAT
  ) {}
}
