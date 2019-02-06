import {
  DisplayObject,
  Texture,
  Sprite,
  SCALE_MODES,
  Container,
  Renderer,
  Loader,
  Rectangle,
} from 'pixi.js';
import Tile from './Tile';
import TextureManager from './TextureManager';
import { GroundFeature } from './GroundFeature';
import { GroundType } from './GroundType';

export default class TileRenderer {
  private groundFeatureTextures: {
    [size: number]: { [key: string]: Texture };
  } = {};
  private groundTypeTextures: {
    [size: number]: { [key: string]: Texture };
  } = {};
  private currentSize?: number;

  public constructor(private readonly renderer: Renderer) {}

  public drawTile = (tile: Tile, size: number): DisplayObject => {
    if (size !== this.currentSize) {
      if (!this.groundFeatureTextures[size]) {
        this.groundFeatureTextures[size] = {};
      }
      Object.keys(TextureManager.groundFeatures).forEach(k => {
        const key = k as GroundFeature;
        if (!this.groundFeatureTextures[size][key]) {
          this.groundFeatureTextures[size][
            key
          ] = this.generateGroundFeatureTexture(key, size);
        }
      });
      if (!this.groundTypeTextures[size]) {
        this.groundTypeTextures[size] = {};
      }
      Object.keys(TextureManager.groundTypes).forEach(k => {
        const key = k as GroundType;
        if (!this.groundTypeTextures[size][key]) {
          this.groundTypeTextures[size][key] = this.generateGroundTypeTexture(
            key,
            size
          );
        }
      });
      this.currentSize = size;
    }

    const container = new Container();

    const tileObject = this.getTileSprite(tile);
    tileObject.position.set(size, size);
    container.addChild(tileObject);

    const groundFeature = this.getGroundFeature(tile.groundFeature);
    if (groundFeature) {
      groundFeature.position.set(size, size);
      container.addChild(groundFeature);
    }

    return container;
  };

  private generateGroundFeatureTexture = (
    groundFeature: GroundFeature,
    size: number
  ): Texture => {
    size *= devicePixelRatio;
    const url = TextureManager.groundFeatures[groundFeature];
    if (!url) {
      return Texture.EMPTY;
    }
    const sprite = new Sprite(Loader.shared.resources[url].texture);
    const width = size * Math.sqrt(3);
    const scale = (width / sprite.width) * 0.9;
    sprite.scale.set(scale, scale);
    const texture = this.renderer.generateTexture(
      sprite,
      SCALE_MODES.LINEAR,
      1,
      new Rectangle(0, 0, sprite.width, sprite.height)
    );

    return texture;
  };

  public generateGroundTypeTexture = (
    groundType: GroundType,
    size: number
  ): Texture => {
    size *= devicePixelRatio; // generate hd textures for high density screens
    const tileTexture = TextureManager.groundTypes[groundType];
    const sprite = new Sprite(Loader.shared.resources[tileTexture].texture);
    const width = size * Math.sqrt(3);
    const scale = width / sprite.width;
    sprite.scale.set(scale, scale);
    const texture = this.renderer.generateTexture(
      sprite,
      SCALE_MODES.LINEAR,
      1,
      new Rectangle(0, 0, sprite.width, sprite.height + devicePixelRatio * 2)
    );
    return texture;
  };

  public getTileSprite = (tile: Tile): DisplayObject => {
    const sprite = new Sprite(
      this.groundTypeTextures[this.currentSize!][tile.groundType]
    );
    const width = sprite.width;
    const targetWidth = Math.round(this.currentSize! * Math.sqrt(3));
    const scale = targetWidth / width;
    sprite.scale.set(scale, scale * Math.cos((30 * Math.PI) / 180));
    sprite.anchor.set(0.5, 0.5);
    return sprite;
  };

  private getGroundFeature = (
    groundFeature: GroundFeature
  ): DisplayObject | null => {
    const texture = this.groundFeatureTextures[this.currentSize!][
      groundFeature
    ]!;
    const sprite = new Sprite(texture);
    const scale = 1 / devicePixelRatio;
    sprite.scale.set(scale, scale);
    sprite.anchor.set(0.5, 0.5);
    return sprite;
  };
}
