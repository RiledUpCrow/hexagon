import { AnyAction } from 'redux';
import Tile from '../../graphics/Tile';
import { Position } from '../../userInterface/TileInfo';

export interface SelectTileAction extends AnyAction {
  tile: Tile;
  position: Position;
}
