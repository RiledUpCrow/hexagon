import { GroundType } from './GroundType';
import { GroundFeature } from './GroundFeature';

export default interface Tile {
  groundType: GroundType;
  groundFeature: GroundFeature | null;
  hill: boolean;
  discovered: boolean;
  visible: boolean;
}
