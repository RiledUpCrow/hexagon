import { DisplayObject, interaction, Point } from "pixi.js";

type Listener = (scale: number, point: Point) => void;

export default class Zoom {
  private readonly listeners: Listener[] = [];
  private point: Point = new Point(0, 0);

  constructor(private readonly displayObject: DisplayObject) {
    document.addEventListener("wheel", this.handleWheel);
    displayObject.on("mousemove", this.handleMove);
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

  private handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    this.listeners.forEach(fn => fn(event.deltaY, this.point));
  };

  private handleMove = (event: interaction.InteractionEvent) => {
    this.point = event.data.global;
  };
}
