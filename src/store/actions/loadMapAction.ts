import { AnyAction } from 'redux';
import Map from '../../data/Map';
import Unit from '../../data/Unit';

export default interface LoadMapAction extends AnyAction {
  map: Map;
  units: Unit[];
}
