import { Container, DisplayObject, Graphics } from 'pixi.js';
import Map from './Map';
import TileRenderer from './TileRenderer';
import Point from './Point';
import DimensionsProvider from './DimensionsProvider';
import between from './between';
import roundTo from './roundTo';

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
    private readonly dp: DimensionsProvider,
    private width: number,
    private height: number,
    private size: number = 50,
    private readonly maxZoom = 1.5,
    private readonly minZoom = 0.5
  ) {
    this.originalSize = size;
    this.granularSize = size;
    this.tiles = [];
    map.tiles.forEach(column => {
      this.tiles.push(new Array(column.length).fill(null));
    });
    this.updateDimensions();
    this.drawMap(true);
  }

  public drawMap = (forceRefresh: boolean = false) => {
    this.drawBackground();

    if (forceRefresh) {
      this.emptyTiles();
    }

    this.mapIterator().forEach((x, y) => {
      if (this.isHidden(x, y)) {
        this.removeTile(x, y);
      } else {
        this.createTile(x, y);
      }
    });

    this.container.sortChildren();
  };

  public moveMapBy = (x: number, y: number) => {
    this.moveMapTo(this.position.x + x, this.position.y + y);
  };

  public moveMapTo = (x: number, y: number) => {
    const { minX, maxX, minY, maxY } = this.dp.getMapBoundaries();
    this.position.x = between(x, minX, maxX);
    this.position.y = between(y, minY, maxY);
    this.container.x = roundTo(this.position.x, devicePixelRatio);
    this.container.y = roundTo(this.position.y, devicePixelRatio);
    this.updateDimensions();
    this.drawMap();
  };

  public resize = (width: number, height: number) => {
    this.width = width;
    this.height = height;
    this.updateDimensions();
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
      this.updateDimensions();
      this.drawMap(true);
      this.moveMapTo(
        this.position.x * scaleX - (((scaleX - 1) * this.width) / 2) * targetX,
        this.position.y * scaleY - (((scaleY - 1) * this.height) / 2) * targetY
      );
    }
  };

  private mapIterator = () => ({
    forEach: (fn: (xIndex: number, yIndex: number) => void) => {
      for (let xIndex = 0; xIndex < this.map.width; xIndex++) {
        for (let yIndex = 0; yIndex < this.map.height; yIndex++) {
          fn(xIndex, yIndex);
        }
      }
    },
  });

  private isHidden = (xIndex: number, yIndex: number) => {
    const { minX, maxX, minY, maxY } = this.dp.getTileIndexBoundaries();
    return xIndex < minX || xIndex > maxX || yIndex < minY || yIndex > maxY;
  };

  private updateDimensions = () => {
    this.dp.setSize(this.size);
    this.dp.setScreen(this.width, this.height);
    this.dp.setMap(this.map.width, this.map.height);
    this.dp.setPosition(this.position.x, this.position.y);
  };

  private drawBackground = () => {
    if (this.background) {
      this.container.removeChild(this.background);
    }
    const { minX, maxX, minY, maxY } = this.dp.getViewBoundaries();
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
    this.mapIterator().forEach((x, y) => this.removeTile(x, y));
  };

  private removeTile = (xIndex: number, yIndex: number) => {
    let renderedTile = this.tiles[xIndex][yIndex];
    if (renderedTile) {
      this.container.removeChild(renderedTile);
    }
    this.tiles[xIndex][yIndex] = null;
  };

  private createTile = (xIndex: number, yIndex: number) => {
    if (this.tiles[xIndex][yIndex]) {
      return;
    }
    const tile = this.map.tiles[xIndex][yIndex];
    if (!tile) {
      return;
    }
    const renderedTile = this.tileRenderer.drawTile(tile, this.size);
    const { x, y } = this.dp.getTileCoordinates(xIndex, yIndex);
    renderedTile.position.set(x, y);
    renderedTile.zIndex = this.map.height * yIndex + xIndex;
    this.container.addChild(renderedTile);
    this.tiles[xIndex][yIndex] = renderedTile;
  };
}

export default Drawer;
