import { DisplayObject } from "pixi.js";

type Listener = (x: number, y: number) => void;

class Drag {
  private down: boolean = false;
  private lastX?: number;
  private lastY?: number;
  private readonly listeners: Listener[] = [];

  constructor(private readonly displayObject: DisplayObject) {
    displayObject.on("pointerdown", event => {
      this.down = true;
      this.lastX = event.data.global.x;
      this.lastY = event.data.global.y;
    });
    displayObject.on("pointerup", () => {
      this.down = false;
      this.lastX = undefined;
      this.lastY = undefined;
    });
    displayObject.on("pointermove", event => {
      if (!this.down) {
        return;
      }
      const { x: currentX, y: currentY } = event.data.global;
      const x = currentX - this.lastX!;
      const y = currentY - this.lastY!;
      this.lastX = currentX;
      this.lastY = currentY;
      this.listeners.forEach(fn => fn(x, y));
    });
  }

  public addListener = (fn: Listener): void => {
    this.listeners.push(fn);
  };

  public removeListener = (fn: Listener): void => {
    const index = this.listeners.indexOf(fn);
    if (index >= 0) {
      this.listeners.splice(index, 1);
    }
  };
}

export default Drag;
