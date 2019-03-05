import Tile from '../../data/Tile';
import MovementCosts from './MovementCosts';

export default class InfantryMovement implements MovementCosts {
  public getCost = (
    fromTile: Tile,
    toTile: Tile,
    left: number
  ): number | null => {
    if (toTile.groundFeature === 'FOREST') {
      return Math.min(2, left);
    }
    switch (toTile.groundType) {
      case 'TUNDRA':
      case 'SNOW':
      case 'PLAINS':
      case 'GRASSLAND':
      case 'DESERT': {
        return 1;
      }
      case 'GRASS_HILL': {
        return Math.min(2, left);
      }
      default: {
        return null;
      }
    }
  };
}
