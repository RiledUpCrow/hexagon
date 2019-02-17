import { AnyAction } from 'redux';
import Unit from '../../data/Unit';

export default interface UpdateUnitAction extends AnyAction {
  unit: Unit;
}
