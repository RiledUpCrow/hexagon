import { Sprite } from 'pixi.js';
import { GroundFeature } from '../data/GroundFeature';
import { GroundType } from '../data/GroundType';
import Position from '../data/Position';
import Tile from '../data/Tile';
import { Side } from '../logic/atSide';
import DimensionsProvider from './DimensionsProvider';
import TextureManager, { TextureName } from './TextureManager';

const LAYER = {
  BASE: 0,
  TEXTURE: 1,
  RIVER: 2,
  SHAPE: 3,
  FEATURES: 4,
};

export default class TileRenderer {
  public constructor(
    protected readonly textureManager: TextureManager,
    protected readonly dp: DimensionsProvider
  ) {}

  public drawTile = (tile: Tile, position: Position): Sprite[] => {
    const container: Sprite[] = [];
    container.push(...this.getTileSprite(tile, position));
    if (tile.groundFeature) {
      container.push(this.getGroundFeature(tile.groundFeature, position));
    }
    return container;
  };

  protected getTileSprite = (tile: Tile, position: Position): Sprite[] => {
    const sprites: Sprite[] = [];
    const base = this.getBaseSprite(tile.groundType);
    base.zIndex = this.getZIndex(LAYER.BASE, position);
    base.tint = this.getBaseColor(tile.groundType);
    sprites.push(base);
    const texture = this.getTextureSprite(tile.groundType);
    if (texture) {
      texture.zIndex = this.getZIndex(LAYER.TEXTURE, position);
      sprites.push(texture);
    }
    tile.rivers.forEach(side => {
      const river = this.getRiverSprite(side);
      river.zIndex = this.getZIndex(LAYER.RIVER, position);
      sprites.push(river);
    });
    const shape = this.getShapeSprite(tile);
    if (shape) {
      shape.zIndex = this.getZIndex(LAYER.SHAPE, position);
      shape.tint = this.getBaseColor(tile.groundType);
      sprites.push(shape);
    }
    return sprites;
  };

  protected getRiverSprite = (side: Side): Sprite => {
    switch (side) {
      case 'EAST':
        return this.getSprite('RIVER_EAST', 0.089483);
      case 'NORTH_EAST':
        return this.getSprite('RIVER_NORTH_EAST', 0.589338);
      case 'NORTH_WEST':
        return this.getSprite('RIVER_NORTH_WEST', 0.589338);
      case 'SOUTH_EAST':
        return this.getSprite('RIVER_SOUTH_EAST', 0.589338);
      case 'SOUTH_WEST':
        return this.getSprite('RIVER_SOUTH_WEST', 0.589338);
      default:
        return this.getSprite('RIVER_WEST', 0.089483);
    }
  };

  protected getTextureSprite = (gt: GroundType): Sprite | null => {
    switch (gt) {
      case 'DESERT':
        return this.getSprite('DESERT');
      case 'GRASSLAND':
        return this.getSprite('GRASSLAND');
      case 'OCEAN':
        return this.getSprite('OCEAN');
      case 'PLAINS':
        return this.getSprite('PLAINS');
      case 'SNOW':
        return this.getSprite('SNOW');
      case 'TUNDRA':
        return this.getSprite('TUNDRA');
      default:
        return null;
    }
  };

  protected getShapeSprite = (tile: Tile): Sprite | null => {
    if (tile.hill) {
      return this.getSprite('HILL');
    }
    if (tile.groundType === 'MOUNTAIN') {
      return this.getSprite('MOUNTAIN');
    }
    return null;
  };

  protected getBaseSprite = (gt: GroundType): Sprite => {
    return gt === 'OCEAN' ? this.getSprite('WATER') : this.getSprite('LAND');
  };

  protected getBaseColor = (gt: GroundType): number => {
    switch (gt) {
      case 'DESERT':
        return 0xf4faa4;
      case 'GRASSLAND':
        return 0x70d813;
      case 'MOUNTAIN':
        return 0x707059;
      case 'OCEAN':
        return 0x337ed4;
      case 'PLAINS':
        return 0xc2f830;
      case 'SNOW':
        return 0xe8f3f9;
      case 'TUNDRA':
        return 0xa9a9a9;
      default:
        return 0xffffff;
    }
  };

  private getSprite = (name: TextureName, scale: number = 1): Sprite => {
    return this.textureManager.getSprite(
      name,
      this.dp.getTileDimensions().width * scale
    )[0];
  };

  protected getGroundFeature = (
    groundFeature: GroundFeature,
    position: Position
  ): Sprite => {
    const [sprite] = this.textureManager.getSprite(
      groundFeature,
      this.dp.getTileDimensions().width
    );
    sprite.zIndex = this.getZIndex(LAYER.FEATURES, position);
    return sprite;
  };

  protected getZIndex = (layer: number, position: Position): number => {
    const { width, height } = this.dp.getMap();
    const { x, y } = position;
    return width * height * layer + height * y + x;
  };
}
