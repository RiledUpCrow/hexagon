import Point from './Point';

class Vector {
  public constructor(public x: number, public y: number) {}

  public multiply = (m: number) => new Vector(this.x * m, this.y * m);

  public length = (): number =>
    Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));

  public add = (vec: Vector) => new Vector(this.x + vec.x, this.y + vec.y);

  public apply = (point: Point) =>
    new Point(point.x + this.x, point.y + this.y);
}

export default Vector;
