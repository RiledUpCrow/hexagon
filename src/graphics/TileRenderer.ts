import { Container, DisplayObject } from 'pixi.js';
import { GroundFeature } from '../data/GroundFeature';
import TextureManager from './TextureManager';
import DimensionsProvider from './DimensionsProvider';
import Tile from '../data/Tile';

export default class TileRenderer {
  public constructor(
    private readonly textureManager: TextureManager,
    private readonly dp: DimensionsProvider
  ) {}

  public drawTile = (tile: Tile): DisplayObject => {
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
    return sprite;
  };

  private getGroundFeature = (groundFeature: GroundFeature): DisplayObject => {
    const { width } = this.dp.getTileDimensions();
    const sprite = this.textureManager.getGroundFeature(groundFeature, width);
    return sprite;
  };
}
