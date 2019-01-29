import { Graphics } from "pixi.js";
import Hex from "./Hex";

class Drawer {
  constructor(private graphics: Graphics) {}

  public drawHex = (hex: Hex) => {
    this.graphics
      .beginFill(0xff0000)
      .moveTo(hex.c1.x, hex.c1.y)
      .lineTo(hex.c2.x, hex.c2.y)
      .lineTo(hex.c3.x, hex.c3.y)
      .lineTo(hex.c4.x, hex.c4.y)
      .lineTo(hex.c5.x, hex.c5.y)
      .lineTo(hex.c6.x, hex.c6.y)
      .endFill();
  };
}

export default Drawer;
