import { GroundFeature } from "./GroundFeature";

export default interface Tile {
  color: number;
  groundFeature: GroundFeature;
}

export class DefaultTile implements Tile {
  constructor(
    public color: number,
    public groundFeature: GroundFeature = "FLAT"
  ) {}
}
