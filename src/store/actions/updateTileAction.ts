import { AnyAction } from 'redux';
import Tile from '../../data/Tile';

export default interface UpdateTileAction extends AnyAction {
  x: number;
  y: number;
  tile: Tile;
}
