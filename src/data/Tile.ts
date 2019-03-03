import { GroundType } from './GroundType';
import { GroundFeature } from './GroundFeature';

export default interface Tile {
  groundType: GroundType;
  groundFeature: GroundFeature | null;
  discovered: boolean;
  visible: boolean;
}
