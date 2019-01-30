import { DisplayObject, Graphics } from "pixi.js";
import Tile from "./Tile";
import Point from "./Point";
import Hex from "./Hex";

export default class TileRenderer {
  constructor(private size: number) {}

  public drawTile = (tile: Tile): DisplayObject => {
    const center = this.getTileCoordinates(tile.x, tile.y);
    const hex = new Hex(center, this.size);
    const graphics = new Graphics();

    graphics
      .beginFill(tile.color)
      .lineStyle(2, 0x000000)
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

  public getTileCoordinates = (x: number, y: number): Point => {
    const width = this.size * Math.sqrt(3);
    const height = this.size * 2;

    const offset = y % 2 !== 0 ? 0.5 : 0;
    const tileY = height * (0.75 * y);
    const tileX = width * (x + offset);

    return new Point(tileX, tileY);
  };
}
