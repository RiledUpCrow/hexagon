import { Container, DisplayObject, Graphics, Renderer } from "pixi.js";
import Map from "./Map";
import TileRenderer from "./TileRenderer";
import Point from "./Point";

class Drawer {
  private readonly originalSize: number;
  private readonly position = { x: 0, y: 0 };
  private readonly tileRenderer: TileRenderer;
  private tiles: (DisplayObject | null)[][] = [];
  private background: DisplayObject | null = null;
  private granularSize: number;

  constructor(
    private readonly renderer: Renderer,
    private readonly container: Container,
    private readonly map: Map,
    private size: number = 100,
    private width: number = window.innerWidth,
    private height: number = window.innerHeight,
    private readonly maxZoom = 1.25,
    private readonly minZoom = 0.25
  ) {
    this.originalSize = size;
    this.granularSize = size;
    this.tileRenderer = new TileRenderer(renderer, size * maxZoom);
    this.drawMap(true);
  }

  private drawBackground = () => {
    if (this.background) {
      this.container.removeChild(this.background);
    }
    const { minX, maxX, minY, maxY } = this.getViewBoundaries();
    this.background = new Graphics()
      .beginFill(0xffffff)
      .moveTo(minX, minY)
      .lineTo(maxX, minY)
      .lineTo(maxX, maxY)
      .lineTo(minX, maxY)
      .closePath()
      .endFill();
    this.container.addChildAt(this.background, 0);
  };

  private emptyTiles = () => {
    this.tiles.forEach(tileColumn => {
      tileColumn.forEach(tile => {
        if (tile) {
          this.container.removeChild(tile);
          tile.destroy();
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
    this.drawBackground();

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
            renderedTile.destroy();
          }
          this.tiles[xIndex][yIndex] = null;
        } else {
          if (!renderedTile) {
            const tile = this.map.tiles[xIndex][yIndex];
            if (!tile) {
              continue;
            }
            renderedTile = this.tileRenderer.drawTile(tile, this.size);
            const { x, y } = this.getTileCoordinates(xIndex, yIndex, this.size);
            renderedTile.position.set(x, y);
            renderedTile.zIndex = this.map.height * yIndex + xIndex;
            this.container.addChild(renderedTile);
            this.tiles[xIndex][yIndex] = renderedTile;
          }
        }
      }
    }

    this.container.sortChildren();
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
    this.container.x =
      Math.round(this.position.x * devicePixelRatio) / devicePixelRatio;
    this.container.y =
      Math.round(this.position.y * devicePixelRatio) / devicePixelRatio;
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

  public zoom = (
    amount: number,
    point: Point = new Point(this.width / 2, this.height / 2)
  ) => {
    const currentZoom = this.granularSize / this.originalSize;
    let targetZoom = currentZoom - amount / 1000;
    if (targetZoom > this.maxZoom) {
      targetZoom = this.maxZoom;
    }
    if (targetZoom < this.minZoom) {
      targetZoom = this.minZoom;
    }
    const targetSize = targetZoom * this.originalSize;
    this.granularSize = targetSize;

    const step = 5;
    const steppedSize = Math.round(this.granularSize / step) * step;
    if (steppedSize !== this.size) {
      const scale = steppedSize / this.size;
      const targetX = (point.x / this.width) * 2;
      const targetY = (point.y / this.height) * 2;
      this.size = steppedSize;
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
    const { width, height } = this.getTileDimensions();
    return {
      borderWidth: width * 2,
      borderHeight: height * 0.75 * 2
    };
  };

  private getMapBoundaries = () => {
    const { borderWidth, borderHeight } = this.getBorderDimensions();
    const { width, height } = this.getTileDimensions();
    const rowHeight = height * 0.75;
    return {
      maxX: borderWidth,
      minX: width * -(this.map.width - 1) + (this.width - borderWidth),
      maxY: borderHeight,
      minY: rowHeight * -(this.map.height - 1) + (this.height - borderHeight)
    };
  };

  private getTileCoordinates = (x: number, y: number, size: number): Point => {
    const { width, height } = this.getTileDimensions();

    const offset = y % 2 !== 0 ? 0.5 : 0;
    const tileY = height * (0.75 * y - 0.5);
    const tileX = width * (x + offset - 0.5);

    return new Point(tileX, tileY);
  };
}

export default Drawer;
