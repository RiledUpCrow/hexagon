import Point from "./Point";
import Vector from "./Vector";

class Hex {
  public c1: Point;
  public c2: Point;
  public c3: Point;
  public c4: Point;
  public c5: Point;
  public c6: Point;
  public height: number;
  public width: number;

  constructor(public center: Point, public size: number) {
    this.c1 = this.getCorner(1);
    this.c2 = this.getCorner(2);
    this.c3 = this.getCorner(3);
    this.c4 = this.getCorner(4);
    this.c5 = this.getCorner(5);
    this.c6 = this.getCorner(6);
    this.height = size * 2;
    this.width = size * Math.sqrt(3);
  }

  public getAdjacentHex = (index: number): Hex => {
    const center = this.getAdjacentCenter(index);
    return new Hex(center, this.size);
  };

  private getAdjacentCenter = (index: number): Point => {
    const vecs: { [id: number]: [number, number] } = {
      1: [0.5, -0.75],
      2: [1, 0],
      3: [0.5, 0.75],
      4: [-0.5, -0.75],
      5: [-1, 0],
      6: [-0.5, 0.75]
    };
    return this.center.add(
      new Vector(this.width * vecs[index][0], this.height * vecs[index][1])
    );
  };

  private getCorner = (index: number): Point => {
    const angleDeg = 60 * index - 30;
    const angleRad = (Math.PI / 180.0) * angleDeg;
    return new Point(
      this.center.x + this.size * Math.cos(angleRad),
      this.center.y + this.size * Math.sin(angleRad)
    );
  };
}

export default Hex;
