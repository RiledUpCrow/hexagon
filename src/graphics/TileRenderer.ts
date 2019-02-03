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
import { GroundFeature, groundFeatures } from "./GroundFeature";
import { groundTypes } from "./GroundType";

export default class TileRenderer {
  private texture?: Texture;
  private groundFeatureTextures: { [key: string]: Texture | null } = {};
  private currentSize?: number;

  constructor(
    private readonly renderer: Renderer,
    private readonly maxSize: number
  ) {}

  public drawTile = (tile: Tile, size: number): DisplayObject => {
    if (size !== this.currentSize) {
      if (this.texture) {
        this.texture.destroy();
      }
      this.texture = this.generateTileTexture(size);
      Object.keys(groundFeatures).forEach(key => {
        if (this.groundFeatureTextures[key]) {
          this.groundFeatureTextures[key]!.destroy();
        }
        this.groundFeatureTextures[key] = this.generateGroundFeatureTexture(
          key,
          size
        );
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

  private generateTileTexture = (size: number): Texture => {
    size += 1;
    size *= devicePixelRatio;
    const center = new Point(size * Math.sqrt(3) * 0.5, size);
    const hex = new Hex(center, size);
    console.log(hex);
    const graphics = new Graphics();

    graphics
      .beginFill(0xffffff)
      .moveTo(hex.c1.x, hex.c1.y)
      .lineTo(hex.c2.x, hex.c2.y)
      .lineTo(hex.c3.x, hex.c3.y)
      .lineTo(hex.c4.x, hex.c4.y)
      .lineTo(hex.c5.x, hex.c5.y)
      .lineTo(hex.c6.x, hex.c6.y)
      .closePath()
      .endFill();

    const texture = this.renderer.generateTexture(
      graphics,
      SCALE_MODES.LINEAR,
      1
    );

    console.log("Tile Textrue", texture);
    return texture;
  };

  private generateGroundFeatureTexture = (
    groundFeature: GroundFeature,
    size: number
  ): Texture | null => {
    size *= devicePixelRatio;
    const url = groundFeatures[groundFeature];
    if (!url) {
      return null;
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

    console.log("Feature textrue", texture);
    return texture;
  };

  public getTileSprite = (tile: Tile): DisplayObject => {
    const sprite = new Sprite(this.texture!);
    const scale = 1 / devicePixelRatio;
    sprite.scale.set(scale, scale);
    sprite.tint = groundTypes[tile.groundType];
    return sprite;
  };

  private getGroundFeature = (
    groundFeature: GroundFeature
  ): DisplayObject | null => {
    const texture = this.groundFeatureTextures[groundFeature]!;
    const sprite = new Sprite(texture);
    const scale = 1 / devicePixelRatio;
    sprite.scale.set(scale, scale);
    sprite.anchor.set(0.5, 0.5);
    return sprite;
  };
}
