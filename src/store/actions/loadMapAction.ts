import { AnyAction } from 'redux';
import Map from '../../data/Map';

export default interface LoadMapAction extends AnyAction {
  map: Map;
}
