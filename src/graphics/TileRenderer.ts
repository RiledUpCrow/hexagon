import { Sprite } from 'pixi.js';
import { GroundFeature } from '../data/GroundFeature';
import Tile from '../data/Tile';
import DimensionsProvider from './DimensionsProvider';
import TextureManager from './TextureManager';
import { Position } from '../userInterface/UnitInfo';

export default class TileRenderer {
  public constructor(
    protected readonly textureManager: TextureManager,
    protected readonly dp: DimensionsProvider
  ) {}

  public drawTile = (tile: Tile, position: Position): Sprite[] => {
    const container: Sprite[] = [];
    container.push(this.getTileSprite(tile, position));
    if (tile.groundFeature) {
      container.push(this.getGroundFeature(tile.groundFeature, position));
    }
    return container;
  };

  protected getTileSprite = (tile: Tile, position: Position): Sprite => {
    const [sprite] = this.textureManager.getGroundType(
      tile.groundType,
      this.dp.getTileDimensions().width
    );
    sprite.zIndex = this.getZIndex(0, position);
    return sprite;
  };

  protected getGroundFeature = (
    groundFeature: GroundFeature,
    position: Position
  ): Sprite => {
    const [sprite] = this.textureManager.getGroundFeature(
      groundFeature,
      this.dp.getTileDimensions().width
    );
    sprite.zIndex = this.getZIndex(1, position);
    return sprite;
  };

  protected getZIndex = (layer: number, position: Position): number => {
    const { width, height } = this.dp.getMap();
    const { x, y } = position;
    return width * height * layer + height * y + x;
  };
}
