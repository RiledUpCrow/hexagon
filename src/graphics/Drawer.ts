import { Container, DisplayObject, Graphics } from 'pixi.js';
import Map from './Map';
import TileRenderer from './TileRenderer';
import Point from './Point';
import DimensionsProvider from './DimensionsProvider';

class Drawer {
  private readonly originalSize: number;
  private readonly position = { x: 0, y: 0 };
  private tiles: (DisplayObject | null)[][] = [];
  private background: DisplayObject | null = null;
  private granularSize: number;

  public constructor(
    private readonly tileRenderer: TileRenderer,
    private readonly container: Container,
    private readonly map: Map,
    private readonly dp: DimensionsProvider = new DimensionsProvider(),
    private size: number = 50,
    private width: number = window.innerWidth,
    private height: number = window.innerHeight,
    private readonly maxZoom = 1.5,
    private readonly minZoom = 0.5
  ) {
    this.originalSize = size;
    this.granularSize = size;
    this.drawMap(true);
  }

  private drawBackground = () => {
    if (this.background) {
      this.container.removeChild(this.background);
    }
    const { minX, maxX, minY, maxY } = this.dp.getViewBoundaries(
      this.container.position,
      { width: this.width, height: this.height }
    );
    this.background = new Graphics()
      .beginFill(0x13062d)
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
      maxYIndex,
    } = this.dp.getTileIndexBoundaries(
      this.size,
      this.dp.getViewBoundaries(this.container.position, {
        width: this.width,
        height: this.height,
      })
    );

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
            const { tileX, tileY } = this.dp.getTileCoordinates(
              this.size,
              xIndex,
              yIndex
            );
            renderedTile.position.set(tileX, tileY);
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
    const { minX, maxX, minY, maxY } = this.dp.getMapBoundaries(
      this.size,
      this.map,
      { width: this.width, height: this.height }
    );
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
      const scaleX =
        Math.round(steppedSize * Math.sqrt(3)) /
        Math.round(this.size * Math.sqrt(3));
      const scaleY = steppedSize / this.size;
      const targetX = (point.x / this.width) * 2;
      const targetY = (point.y / this.height) * 2;
      this.size = steppedSize;
      this.drawMap(true);
      this.moveMapTo(
        this.position.x * scaleX - (((scaleX - 1) * this.width) / 2) * targetX,
        this.position.y * scaleY - (((scaleY - 1) * this.height) / 2) * targetY
      );
    }
  };
}

export default Drawer;
