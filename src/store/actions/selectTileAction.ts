import { Action } from 'redux';
import { ActionType } from '.';
import Position from '../../data/Position';
import Tile from '../../data/Tile';

export interface SelectTileAction extends Action<ActionType> {
  type: 'select_tile';
  tile: Tile;
  position: Position;
}
