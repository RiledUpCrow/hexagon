import {
  DisplayObject,
  Graphics,
  Texture,
  Sprite,
  SCALE_MODES,
  Container,
  Renderer,
  Loader,
  Rectangle
} from "pixi.js";
import Tile from "./Tile";
import Point from "./Point";
import Hex from "./Hex";
import TextureManager from "./TextureManager";
import { GroundFeature } from "./GroundFeature";
import { GroundType } from "./GroundType";

export default class TileRenderer {
  private hexShape?: Graphics;
  private groundFeatureTextures: {
    [size: number]: { [key: string]: Texture };
  } = {};
  private groundTypeTextures: {
    [size: number]: { [key: string]: Texture };
  } = {};
  private currentSize?: number;

  constructor(
    private readonly renderer: Renderer,
    private readonly maxSize: number
  ) {}

  public drawTile = (tile: Tile, size: number): DisplayObject => {
    if (size !== this.currentSize) {
      if (this.hexShape) {
        this.hexShape.destroy();
      }
      this.hexShape = this.generateTileShape(size);
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

    const middleX = (size * Math.sqrt(3)) / 2;
    const middleY = size;

    const container = new Container();

    const tileObject = this.getTileSprite(tile);
    container.addChild(tileObject);

    const groundFeature = this.getGroundFeature(tile.groundFeature);
    if (groundFeature) {
      groundFeature.position.set(middleX, middleY);
      container.addChild(groundFeature);
    }

    return container;
  };

  private generateTileShape = (size: number): Graphics => {
    size += 1;
    size *= devicePixelRatio;
    const center = new Point(size * Math.sqrt(3) * 0.5, size);
    const hex = new Hex(center, size);
    const graphics = new Graphics();

    graphics
      .beginFill(0xffff00)
      .moveTo(hex.c1.x, hex.c1.y)
      .lineTo(hex.c2.x, hex.c2.y)
      .lineTo(hex.c3.x, hex.c3.y)
      .lineTo(hex.c4.x, hex.c4.y)
      .lineTo(hex.c5.x, hex.c5.y)
      .lineTo(hex.c6.x, hex.c6.y)
      .closePath()
      .endFill();

    return graphics;
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
    size *= devicePixelRatio;
    const tileTexture = TextureManager.groundTypes[groundType];
    const sprite = new Sprite(Loader.shared.resources[tileTexture].texture);
    const height = size * 2;
    const scale = height / sprite.height;
    sprite.scale.set(scale, scale);
    sprite.mask = this.hexShape!;
    const texture = this.renderer.generateTexture(
      sprite,
      SCALE_MODES.LINEAR,
      1,
      new Rectangle(0, 0, sprite.width, sprite.height)
    );
    return texture;
  };

  public getTileSprite = (tile: Tile): DisplayObject => {
    const sprite = new Sprite(
      this.groundTypeTextures[this.currentSize!][tile.groundType]
    );
    const scale = 1 / devicePixelRatio;
    sprite.scale.set(scale, scale);
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
