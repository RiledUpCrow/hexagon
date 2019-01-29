class Vector {
  constructor(public x: number, public y: number) {}

  public multiply = (m: number) => {
    this.x *= m;
    this.y *= m;
  };
}

export default Vector;
