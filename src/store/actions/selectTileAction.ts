import { AnyAction } from 'redux';
import { Position } from '../../userInterface/TileInfo';
import Tile from '../../data/Tile';

export interface SelectTileAction extends AnyAction {
  tile: Tile;
  position: Position;
}
