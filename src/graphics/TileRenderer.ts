import { Container, DisplayObject } from 'pixi.js';
import { GroundFeature } from './GroundFeature';
import TextureManager from './TextureManager';
import Tile from './Tile';

export default class TileRenderer {
  private currentSize?: number;

  public constructor(private readonly textureManager: TextureManager) {}

  public drawTile = (tile: Tile, size: number): DisplayObject => {
    this.currentSize = size;
    const container = new Container();
    const tileObject = this.getTileSprite(tile);
    tileObject.position.set(size, size);
    container.addChild(tileObject);

    const groundFeature = tile.groundFeature
      ? this.getGroundFeature(tile.groundFeature)
      : null;
    if (groundFeature) {
      groundFeature.position.set(size, size);
      container.addChild(groundFeature);
    }

    return container;
  };

  public getTileSprite = (tile: Tile): DisplayObject => {
    const targetWidth = Math.round(this.currentSize! * Math.sqrt(3));
    const sprite = this.textureManager.getGroundType(
      tile.groundType,
      targetWidth
    );
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
