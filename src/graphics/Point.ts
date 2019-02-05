import * as PIXI from 'pixi.js';
import Vector from './Vector';

class Point {
  constructor(public readonly x: number, public readonly y: number) {}

  public distance = (target: Point) => this.getDirection(target).length();

  public add = (vec: Vector) => new Point(this.x + vec.x, this.y + vec.y);

  public getDirection = (target: Point) =>
    new Vector(target.x - this.x, target.y - this.y);

  public static fromPixi(point: PIXI.Point): Point {
    return new Point(point.x, point.y);
  }
}

export default Point;
