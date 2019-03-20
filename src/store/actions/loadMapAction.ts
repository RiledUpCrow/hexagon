import { Action } from 'redux';
import { ActionType } from '.';
import Map from '../../data/Map';
import Unit from '../../data/Unit';

export default interface LoadMapAction extends Action<ActionType> {
  type: 'load_map';
  map: Map;
  units: Unit[];
}
