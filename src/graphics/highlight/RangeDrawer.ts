import { DisplayObject, Graphics } from 'pixi.js';
import { Highlight } from '../../data/Highlight';
import Position from '../../data/Position';
import atSide, { Side } from '../../logic/atSide';
import DimensionsProvider from '../DimensionsProvider';
import Hex from '../Hex';
import Point from '../Point';
import HighlightDrawer from './HighlightDrawer';

export default class RangeDrawer implements HighlightDrawer {
  public constructor(protected readonly dp: DimensionsProvider) {}

  public draw = (highlight: Highlight): DisplayObject => {
    if (highlight.type !== 'range') {
      throw new Error('Incorrect highlight type');
    }
    const path = this.calculatePath(highlight.tiles);
    const shape = this.getShape(path, highlight.color);
    return shape;
  };

  protected calculatePath = (tiles: Position[]): Position[] => {
    // TODO: implement "holes" in the area
    const points: [Position, Position][] = [];

    tiles.forEach(tile => {
      const hex = new Hex(
        Point.fromPosition(this.dp.getTileCoordinates(tile.x, tile.y)),
        this.dp.getSize()
      );

      const hasNeighbor = (side: Side): boolean => {
        const neighbor = atSide(tile, side);
        return (
          tiles.find(t => t.x === neighbor.x && t.y === neighbor.y) !==
          undefined
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
      return [];
    }

    const path: Position[] = [];
    const firstPoint = points[0][0];
    path.push(firstPoint);
    let lastPoint = points[0][1];
    while (this.distance(lastPoint, firstPoint) > 2) {
      const next = points.find(p => this.distance(p[0], lastPoint) < 2)!;
      path.push(next[0]);
      lastPoint = next[1];
    }
    path.push(lastPoint);

    return path;
  };

  protected distance = (pos1: Position, pos2: Position): number => {
    return Point.fromPosition(pos1).distance(Point.fromPosition(pos2));
  };

  protected getShape = (path: Position[], color: number): DisplayObject => {
    const shape = new Graphics();
    shape.lineStyle(this.dp.getSize() / 10, color);
    shape.beginFill(color, 0.6);
    shape.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
      shape.lineTo(path[i].x, path[i].y);
    }
    shape.endFill();
    return shape;
  };
}
