import { AnyAction } from 'redux';
import Unit from '../../data/Unit';

export default interface SelectUnitAction extends AnyAction {
  unit: Unit;
}
