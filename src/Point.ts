import Vector from "./Vector";

class Point {
  constructor(public readonly x: number, public readonly y: number) {}

  public distance = (target: Point) =>
    Math.sqrt(Math.pow(this.x - target.x, 2) + Math.pow(this.y - target.y, 2));

  public add = (vec: Vector) => new Point(this.x + vec.x, this.y + vec.y);
}

export default Point;
