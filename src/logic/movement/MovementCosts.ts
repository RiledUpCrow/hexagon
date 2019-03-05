import Tile from '../../data/Tile';

export default interface MovementCosts {
  getCost: (
    fromTile: Tile,
    toTile: Tile,
    movementLeft: number
  ) => number | null;
}
