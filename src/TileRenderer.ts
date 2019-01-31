import { DisplayObject, Graphics } from "pixi.js";
import Tile from "./Tile";
import Point from "./Point";
import Hex from "./Hex";

export default class TileRenderer {
  constructor() {}

  public drawTile = (tile: Tile, size: number): DisplayObject => {
    const center = this.getTileCoordinates(tile.x, tile.y, size);
    const hex = new Hex(center, size);
    const graphics = new Graphics();

    graphics
      .beginFill(tile.color)
      .lineStyle(size / 20, 0x000000)
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

  private getTileCoordinates = (x: number, y: number, size: number): Point => {
    const width = size * Math.sqrt(3);
    const height = size * 2;

    const offset = y % 2 !== 0 ? 0.5 : 0;
    const tileY = height * (0.75 * y);
    const tileX = width * (x + offset);

    return new Point(tileX, tileY);
  };
}
