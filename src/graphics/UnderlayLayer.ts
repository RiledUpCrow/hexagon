import MapLayer from './MapLayer';
import { Container, Graphics } from 'pixi.js';
import TextureManager from './TextureManager';
import { RootState } from '../store/reducers';
import DimensionsProvider from './DimensionsProvider';
import Highlight from '../data/Highlight';
import atSide, { Side } from '../logic/atSide';
import Hex from './Hex';
import Point from './Point';
import { Position } from '../userInterface/UnitInfo';

export default class UnderlayLayer implements MapLayer {
  protected readonly highlighs: () => Highlight[];

  public constructor(
    protected readonly container: Container,
    protected readonly textureManager: TextureManager,
    protected readonly getState: () => RootState,
    protected readonly dp: DimensionsProvider
  ) {
    this.highlighs = () => getState().highlight;
  }

  public draw = (): void => {
    this.container.removeChildren();
    const highlighs = this.highlighs();
    highlighs.forEach(highlight => {
      const points: [Position, Position][] = [];

      highlight.tiles.forEach(tile => {
        const hex = new Hex(
          Point.fromPosition(this.dp.getTileCoordinates(tile.x, tile.y)),
          this.dp.getSize()
        );

        const hasNeighbor = (side: Side): boolean => {
          const neighbor = atSide(tile, side);
          return (
            highlight.tiles.find(
              t => t.x === neighbor.x && t.y === neighbor.y
            ) !== undefined
          );
        };

        !hasNeighbor('NORTH_WEST') && points.push([hex.c4, hex.c5]);
        !hasNeighbor('NORTH_EAST') && points.push([hex.c5, hex.c6]);
        !hasNeighbor('EAST') && points.push([hex.c6, hex.c1]);
        !hasNeighbor('SOUTH_EAST') && points.push([hex.c1, hex.c2]);
        !hasNeighbor('SOUTH_WEST') && points.push([hex.c2, hex.c3]);
        !hasNeighbor('WEST') && points.push([hex.c3, hex.c4]);
      });

      if (points.length === 0) {
        return;
      }

      const path: Position[] = [];
      const firstPoint = points[0][0];
      path.push(firstPoint);
      let lastPoint = points[0][1];
      while (!(lastPoint.x === firstPoint.x && lastPoint.y === firstPoint.y)) {
        const next = points.find(p => {
          const thisPoint = p[0];
          const { x: x1, y: y1 } = thisPoint;
          const { x: x2, y: y2 } = lastPoint;
          const distance = Math.sqrt(
            Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)
          );
          return distance < 2;
        })!;
        path.push(next[0]);
        lastPoint = next[1];
      }

      const shape = new Graphics();
      shape.lineStyle(this.dp.getSize() / 10, highlight.color);
      shape.beginFill(highlight.color, 0.6);
      shape.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        shape.lineTo(path[i].x, path[i].y);
      }
      shape.lineTo(lastPoint.x, lastPoint.y);
      shape.endFill();

      this.container.addChild(shape);
    });
  };

  public update = (): void => {};

  public animate = (): void => {};
}
