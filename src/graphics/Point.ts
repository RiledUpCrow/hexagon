import * as PIXI from 'pixi.js';
import Vector from './Vector';
import { Position } from '../userInterface/TileInfo';

class Point implements Position {
  public constructor(public readonly x: number, public readonly y: number) {}

  public distance = (target: Point) => this.getDirection(target).length();

  public add = (vec: Vector) => new Point(this.x + vec.x, this.y + vec.y);

  public getDirection = (target: Point) =>
    new Vector(target.x - this.x, target.y - this.y);

  public static fromPixi = (point: PIXI.Point): Point => {
    return Point.fromPosition(point);
  };

  public static fromPosition = (pos: Position): Point => {
    return new Point(pos.x, pos.y);
  };
}

export default Point;
