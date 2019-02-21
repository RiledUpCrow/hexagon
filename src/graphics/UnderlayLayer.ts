import MapLayer from './MapLayer';
import { Container, Graphics, DisplayObject } from 'pixi.js';
import TextureManager from './TextureManager';
import { RootState } from '../store/reducers';
import DimensionsProvider from './DimensionsProvider';
import Highlight from '../data/Highlight';
import atSide, { Side } from '../logic/atSide';
import Hex from './Hex';
import Point from './Point';
import { Position } from '../userInterface/UnitInfo';

export default class UnderlayLayer implements MapLayer {
  protected readonly highlights: () => Highlight[];
  protected readonly renderedHighlights: { [id: number]: DisplayObject } = {};

  public constructor(
    protected readonly container: Container,
    protected readonly textureManager: TextureManager,
    protected readonly getState: () => RootState,
    protected readonly dp: DimensionsProvider
  ) {
    this.highlights = () => getState().highlight;
  }

  public draw = (): void => {
    const highlights = this.highlights();
    highlights.forEach(highlight => {
      this.renderHighlight(highlight);
    });
  };

  public resize = (): void => {
    const highlights = this.highlights();
    highlights.forEach(highlight => {
      this.removeHighlight(highlight);
    });
  };

  public update = (): void => {};

  public animate = (): void => {};

  protected renderHighlight = (highlight: Highlight): void => {
    if (this.renderedHighlights[highlight.id]) {
      return;
    }
    const path = this.calculatePath(highlight.tiles);
    const shape = this.getShape(path, highlight.color);
    this.renderedHighlights[highlight.id] = shape;
    this.container.addChild(shape);
  };

  protected removeHighlight = (highlight: Highlight): void => {
    if (!this.renderedHighlights[highlight.id]) {
      return;
    }
    this.container.removeChild(this.renderedHighlights[highlight.id]);
    delete this.renderedHighlights[highlight.id];
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

  private distance = (pos1: Position, pos2: Position): number => {
    return Point.fromPosition(pos1).distance(Point.fromPosition(pos2));
  };

  public getShape = (path: Position[], color: number): DisplayObject => {
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
