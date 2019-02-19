import { DisplayObject, Container } from 'pixi.js';
import TileRenderer from './TileRenderer';
import Map from '../data/Map';
import DimensionsProvider, { Boundaries } from './DimensionsProvider';
import MapLayer from './MapLayer';
import { Position } from '../userInterface/TileInfo';
import TextureManager from './TextureManager';
import { RootState } from '../store/reducers';

export default class TileLayer implements MapLayer {
  protected readonly tileRenderer: TileRenderer;
  protected readonly map: () => Map;
  protected tiles: (DisplayObject | null)[][] = [];
  protected previousMap: Map;

  public constructor(
    protected readonly container: Container,
    protected readonly textureManager: TextureManager,
    protected readonly getState: () => RootState,
    protected readonly dp: DimensionsProvider
  ) {
    this.map = () => getState().map!;
    this.tileRenderer = new TileRenderer(textureManager, dp);
    this.previousMap = this.map();
    this.tiles = [];
    this.map().tiles.forEach(column => {
      this.tiles.push(new Array(column.length).fill(null));
    });
  }

  public draw = (forceRefresh: boolean = false) => {
    if (forceRefresh) {
      this.emptyTiles();
    }

    const boundaries = this.dp.getTileIndexBoundaries();

    this.mapIterator().forEach((x, y) => {
      if (this.isHidden(x, y, boundaries)) {
        this.removeTile(x, y, forceRefresh);
      } else {
        this.createTile(x, y);
      }
    });

    this.container.sortChildren();

    return this.container;
  };

  public update = (): void => {
    const currentMap = this.map();
    const boundaries = this.dp.getTileIndexBoundaries();
    if (currentMap !== this.previousMap) {
      const changed: Position[] = [];
      const { tiles, width, height } = currentMap;
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          if (this.previousMap.tiles[x][y] !== tiles[x][y]) {
            changed.push({ x, y });
          }
        }
      }
      changed.forEach(position => this.updateTile(position, boundaries));
    }
    this.previousMap = currentMap;
  };

  public animate = () => undefined;

  protected updateTile = (position: Position, boundaries: Boundaries) => {
    const { x, y } = position;
    if (!this.isHidden(x, y, boundaries)) {
      this.removeTile(x, y, true);
      this.createTile(x, y);
    }
    this.container.sortChildren();
  };

  protected mapIterator = () => ({
    forEach: (fn: (xIndex: number, yIndex: number) => void) => {
      for (let xIndex = 0; xIndex < this.map().width; xIndex++) {
        for (let yIndex = 0; yIndex < this.map().height; yIndex++) {
          fn(xIndex, yIndex);
        }
      }
    },
  });

  protected isHidden = (
    xIndex: number,
    yIndex: number,
    boundaries: Boundaries
  ) => {
    const { minX, maxX, minY, maxY } = boundaries;
    return xIndex < minX || xIndex > maxX || yIndex < minY || yIndex > maxY;
  };

  protected emptyTiles = () => {
    this.mapIterator().forEach((x, y) => this.removeTile(x, y, true));
  };

  protected removeTile = (
    xIndex: number,
    yIndex: number,
    forceRefresh: boolean
  ) => {
    let renderedTile = this.tiles[xIndex][yIndex];
    if (!renderedTile) {
      return;
    }
    if (forceRefresh) {
      this.container.removeChild(renderedTile);
      this.tiles[xIndex][yIndex] = null;
    } else {
      renderedTile.visible = false;
    }
  };

  protected createTile = (xIndex: number, yIndex: number) => {
    if (this.tiles[xIndex][yIndex]) {
      this.tiles[xIndex][yIndex]!.visible = true;
      return;
    }
    const tile = this.map().tiles[xIndex][yIndex];
    if (!tile) {
      return;
    }
    const renderedTile = this.tileRenderer.drawTile(tile);
    const { x, y } = this.dp.getTileCoordinates(xIndex, yIndex);
    renderedTile.position.set(x, y);
    renderedTile.zIndex = this.map().height * yIndex + xIndex;
    this.container.addChild(renderedTile);
    this.tiles[xIndex][yIndex] = renderedTile;
  };
}
