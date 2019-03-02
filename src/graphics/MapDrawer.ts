import DimensionsProvider from './DimensionsProvider';
import Point from './Point';
import between from '../logic/between';
import Map from '../data/Map';
import { Container } from 'pixi.js';
import roundTo from '../logic/roundTo';
import MapLayer from './MapLayer';

export default class MapDrawer {
  protected readonly position = { x: 0, y: 0 };
  protected readonly originalSize: number;

  public constructor(
    protected readonly layers: MapLayer[],
    protected readonly container: Container,
    protected readonly map: () => Map,
    protected readonly dp: DimensionsProvider,
    protected size = 50,
    protected width = window.innerWidth,
    protected height = window.innerHeight
  ) {
    this.originalSize = size;
  }

  public drawMap = () => {
    this.layers.forEach(layer => layer.draw());
  };

  public resizeMap = () => {
    this.layers.forEach(layer => layer.resize());
  };

  public moveBy = (x: number, y: number) => {
    this.moveTo(this.position.x + x, this.position.y + y);
  };

  public moveTo = (x: number, y: number) => {
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
    const currentZoom = this.size / this.originalSize;
    let targetZoom = between(
      currentZoom - amount / 1000,
      this.dp.minZoom,
      this.dp.maxZoom
    );
    const targetSize = targetZoom * this.originalSize;

    if (targetSize !== this.size) {
      const { scaleX, scaleY } = this.dp.getScale(targetSize);
      const beforeLocal = this.dp.toLocalPoint(point);
      const afterLocal = {
        x: beforeLocal.x * scaleX,
        y: beforeLocal.y * scaleY,
      };
      const afterGlobal = this.dp.toGlobalPoint(afterLocal);
      this.size = targetSize;
      this.updateDimensions();
      this.resizeMap();
      this.moveBy(point.x - afterGlobal.x, point.y - afterGlobal.y);
    }
  };

  private updateDimensions = () => {
    this.dp.setSize(this.size);
    this.dp.setScreen(this.width, this.height);
    this.dp.setMap(this.map().width, this.map().height);
    this.dp.setPosition(this.position.x, this.position.y);
  };
}
