import { GroundType } from './GroundType';
import { GroundFeature } from './GroundFeature';
import { Side } from '../logic/atSide';

export default interface Tile {
  groundType: GroundType;
  groundFeature: GroundFeature | null;
  hill: boolean;
  discovered: boolean;
  visible: boolean;
  rivers: Side[];
}
