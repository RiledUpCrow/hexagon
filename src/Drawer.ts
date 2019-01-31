import { Container, DisplayObject } from "pixi.js";
import Map from "./Map";
import TileRenderer from "./TileRenderer";

class Drawer {
  private readonly position = {
    x: 0,
    y: 0
  };
  private readonly tileRenderer: TileRenderer;
  private readonly tiles: (DisplayObject | null)[][];

  constructor(
    private container: Container,
    private map: Map,
    private size: number,
    private width: number,
    private height: number
  ) {
    this.tileRenderer = new TileRenderer(size);
    this.tiles = [];
    map.tiles.forEach(tileColumn => {
      const newArray = new Array(tileColumn.length).fill(null);
      this.tiles.push(newArray);
    });
  }

  public drawMap = () => {
    const {
      minXIndex,
      maxXIndex,
      minYIndex,
      maxYIndex
    } = this.getTileIndexBoundaries();

    for (let xIndex = 0; xIndex < this.map.width; xIndex++) {
      for (let yIndex = 0; yIndex < this.map.height; yIndex++) {
        const hide =
          xIndex < minXIndex ||
          xIndex > maxXIndex ||
          yIndex < minYIndex ||
          yIndex > maxYIndex;
        let renderedTile = this.tiles[xIndex][yIndex];
        if (hide) {
          if (renderedTile) {
            this.container.removeChild(renderedTile);
          }
          this.tiles[xIndex][yIndex] = null;
        } else {
          if (!renderedTile) {
            const tile = this.map.tiles[xIndex][yIndex];
            renderedTile = this.tileRenderer.drawTile(tile);
            this.container.addChild(renderedTile);
            this.tiles[xIndex][yIndex] = renderedTile;
          }
        }
      }
    }
  };

  public moveMapBy = (x: number, y: number) => {
    this.moveMapTo(this.position.x + x, this.position.y + y);
  };

  public moveMapTo = (x: number, y: number) => {
    const { minX, maxX, minY, maxY } = this.getMapBoundaries();
    console.log(x, y, minX, minY);
    if (x < minX) {
      x = minX;
    }
    if (x > maxX) {
      x = maxX;
    }
    if (y < minY) {
      y = minY;
    }
    if (y > maxY) {
      y = maxY;
    }
    this.position.x = x;
    this.position.y = y;
    this.container.x = this.position.x;
    this.container.y = this.position.y;
    this.drawMap();
  };

  public getMapPosition = (): { x: number; y: number } => {
    return { ...this.position };
  };

  public resize = (width: number, height: number) => {
    this.width = width;
    this.height = height;
    this.drawMap();
  };

  private getTileIndexBoundaries = () => {
    const { minX, maxX, minY, maxY } = this.getViewBoundaries();
    const { width, height } = this.getTileDimensions();
    const rowHeight = height * 0.75;

    const minXIndex = Math.floor(minX / width);
    const maxXIndex = Math.ceil(maxX / width);

    const minYIndex = Math.floor(minY / rowHeight);
    const maxYIndex = Math.ceil(maxY / rowHeight);

    return { minXIndex, maxXIndex, minYIndex, maxYIndex };
  };

  private getTileDimensions = () => {
    return {
      width: this.size * Math.sqrt(3),
      height: this.size * 2
    };
  };

  private getViewBoundaries = () => {
    return {
      minX: -this.position.x,
      maxX: -this.position.x + this.width,
      minY: -this.position.y,
      maxY: -this.position.y + this.height
    };
  };

  private getMapBoundaries = () => {
    const { width, height } = this.getTileDimensions();
    const borderWidth = this.width / 2;
    const borderHeight = this.height / 2;
    const rowHeight = height * 0.75;
    return {
      maxX: borderWidth,
      minX: -(width * this.map.width - borderWidth),
      maxY: borderHeight,
      minY: -(rowHeight * this.map.height - borderHeight)
    };
  };
}

export default Drawer;
