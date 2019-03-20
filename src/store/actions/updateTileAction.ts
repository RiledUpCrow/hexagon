import { Action } from 'redux';
import { ActionType } from '.';
import Tile from '../../data/Tile';

export default interface UpdateTileAction extends Action<ActionType> {
  type: 'update_tile';
  x: number;
  y: number;
  tile: Tile;
}
