import { Container, DisplayObject } from 'pixi.js';
import { GroundFeature } from './GroundFeature';
import TextureManager from './TextureManager';
import Tile from './Tile';
import DimensionsProvider from './DimensionsProvider';

export default class TileRenderer {
  private currentSize?: number;

  public constructor(
    private readonly textureManager: TextureManager,
    private readonly dp: DimensionsProvider
  ) {}

  public drawTile = (tile: Tile, size: number): DisplayObject => {
    this.currentSize = size;
    const container = new Container();
    const tileObject = this.getTileSprite(tile);
    container.addChild(tileObject);

    const groundFeature = tile.groundFeature
      ? this.getGroundFeature(tile.groundFeature)
      : null;
    if (groundFeature) {
      container.addChild(groundFeature);
    }

    return container;
  };

  public getTileSprite = (tile: Tile): DisplayObject => {
    const { width } = this.dp.getTileDimensions();
    const sprite = this.textureManager.getGroundType(tile.groundType, width);
    sprite.scale.y *= Math.cos((30 * Math.PI) / 180);
    return sprite;
  };

  private getGroundFeature = (groundFeature: GroundFeature): DisplayObject => {
    const sprite = this.textureManager.getGroundFeature(
      groundFeature,
      this.currentSize!
    );
    return sprite;
  };
}
