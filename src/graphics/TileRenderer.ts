import { DisplayObject, Graphics, Texture, Sprite, SCALE_MODES } from "pixi.js";
import Tile from "./Tile";
import Point from "./Point";
import Hex from "./Hex";

export default class TileRenderer {
  private texture: Texture;

  constructor(private readonly maxSize: number) {
    this.texture = this.generateTileTexture(maxSize);
  }

  public drawTile = (tile: Tile, size: number): DisplayObject => {
    const sprite = new Sprite(this.texture);
    const scale = size / this.maxSize;
    sprite.scale.set(scale, scale);
    sprite.tint = tile.color;
    sprite.anchor.set(0.5);
    return sprite;
  };

  private generateTileTexture = (size: number): Texture => {
    const center = new Point(0, 0);
    const hex = new Hex(center, size);
    const graphics = new Graphics();

    graphics
      .beginFill(0xffffff)
      .lineStyle(size / 20, 0x000000)
      .moveTo(hex.c1.x, hex.c1.y)
      .lineTo(hex.c2.x, hex.c2.y)
      .lineTo(hex.c3.x, hex.c3.y)
      .lineTo(hex.c4.x, hex.c4.y)
      .lineTo(hex.c5.x, hex.c5.y)
      .lineTo(hex.c6.x, hex.c6.y)
      .closePath()
      .endFill();

    return graphics.generateCanvasTexture(SCALE_MODES.LINEAR, 1.5);
  };
}
