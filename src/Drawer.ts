import { Container, DisplayObject, Rectangle, Graphics } from "pixi.js";
import Map from "./Map";
import TileRenderer from "./TileRenderer";
import Point from "./Point";

class Drawer {
  private readonly originalSize: number;
  private readonly position = {
    x: 0,
    y: 0
  };
  private readonly tileRenderer: TileRenderer;
  private tiles: (DisplayObject | null)[][] = [];

  constructor(
    private container: Container,
    private map: Map,
    private size: number,
    private width: number,
    private height: number,
    private scale: Point = new Point(1, 1)
  ) {
    this.originalSize = size;
    this.tileRenderer = new TileRenderer();
    this.emptyTiles();
    this.drawBackground();
  }

  private drawBackground = () => {
    const { minX, maxX, minY, maxY } = this.getScreenBoundaries();
    const background = new Graphics()
      .beginFill(0xffffff)
      .moveTo(minX, minY)
      .lineTo(maxX, minY)
      .lineTo(maxX, maxY)
      .lineTo(minX, maxY)
      .closePath()
      .endFill();
    this.container.addChild(background);
  };

  private emptyTiles = () => {
    this.tiles.forEach(tileColumn => {
      tileColumn.forEach(tile => {
        if (tile) {
          this.container.removeChild(tile);
        }
      });
    });
    this.tiles = [];
    this.map.tiles.forEach(tileColumn => {
      const newArray = new Array(tileColumn.length).fill(null);
      this.tiles.push(newArray);
    });
  };

  public drawMap = (forceRefresh: boolean = false) => {
    if (forceRefresh) {
      this.emptyTiles();
    }

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
            if (!tile) {
              continue;
            }
            renderedTile = this.tileRenderer.drawTile(tile, this.size);
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

  public zoom = (amount: number, point: Point) => {
    const currentZoom = (this.size / this.originalSize) * 1000;
    let targetZoom = currentZoom - amount;
    if (targetZoom > 2000) {
      targetZoom = 2000;
    }
    if (targetZoom < 500) {
      targetZoom = 500;
    }
    const targetSize = (targetZoom / 1000) * this.originalSize;
    if (targetSize !== this.size) {
      const scale = targetSize / this.size;
      const targetX = (point.x / this.width) * 2;
      const targetY = (point.y / this.height) * 2;
      this.size = targetSize;
      this.drawMap(true);
      this.moveMapTo(
        this.position.x * scale - (((scale - 1) * this.width) / 2) * targetX,
        this.position.y * scale - (((scale - 1) * this.height) / 2) * targetY
      );
    }
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

  private getBorderDimensions = () => {
    const thickness = Math.min(this.width, this.height) / 4;
    return {
      borderWidth: thickness,
      borderHeight: thickness
    };
  };

  private getMapBoundaries = () => {
    const { borderWidth, borderHeight } = this.getBorderDimensions();
    const { width, height } = this.getTileDimensions();
    const rowHeight = height * 0.75;
    return {
      maxX: borderWidth,
      minX: width * -this.map.width + (this.width - borderWidth),
      maxY: borderHeight,
      minY: rowHeight * -this.map.height + (this.height - borderHeight)
    };
  };

  private getScreenBoundaries = () => {
    const { borderWidth, borderHeight } = this.getBorderDimensions();
    const { width, height } = this.getTileDimensions();
    const rowHeight = height * 0.75;
    return {
      minX: -borderWidth,
      maxX: width * this.map.width + borderWidth,
      minY: -borderHeight,
      maxY: rowHeight * this.map.height + borderHeight
    };
  };
}

export default Drawer;
