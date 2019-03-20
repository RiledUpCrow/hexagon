import { ActionType } from '.';
import Tile from '../../data/Tile';
import { Position } from '../../userInterface/TileInfo';
import { Action } from 'redux';

export interface SelectTileAction extends Action<ActionType> {
  type: 'select_tile';
  tile: Tile;
  position: Position;
}
