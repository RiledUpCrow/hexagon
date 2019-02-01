import { DisplayObject, interaction } from "pixi.js";
import Point from "./Point";

type Listener = (scale: number, point?: Point) => void;

export default class Zoom {
  private readonly listeners: Listener[] = [];
  private lastFirst: Point | null = null;
  private lastSecond: Point | null = null;
  private point: Point = new Point(0, 0);

  constructor(private readonly displayObject: DisplayObject) {
    document.addEventListener("wheel", this.handleWheel);
    displayObject.on("mousemove", this.handleMove);
    displayObject.on("touchend", this.handleFingerLift);
    displayObject.on("touchendoutside", this.handleFingerLift);
    displayObject.on("touchcancel", this.handleFingerLift);
    displayObject.on("touchstart", this.handleFingerLift);
    displayObject.on("touchmove", this.handlePinch);
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

  private runListeners = (zoom: number, target?: Point) => {
    this.listeners.forEach(fn => fn(zoom, target));
  };

  private handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    const zoom = event.deltaY;
    this.runListeners(zoom, zoom > 0 ? undefined : this.point);
  };

  private handleMove = (event: interaction.InteractionEvent) => {
    this.point = Point.fromPixi(event.data.global);
  };

  private handleFingerLift = (event: interaction.InteractionEvent) => {
    this.lastFirst = null;
    this.lastSecond = null;
  };

  private handlePinch = (event: interaction.InteractionEvent) => {
    const touches = (event.data.originalEvent as TouchEvent).targetTouches;
    if (touches.length !== 2) {
      this.lastFirst = null;
      this.lastSecond = null;
      return;
    }
    const first = new Point(touches[0].clientX, touches[0].clientY);
    const second = new Point(touches[1].clientX, touches[1].clientY);
    if (!this.lastFirst || !this.lastSecond) {
      this.lastFirst = first;
      this.lastSecond = second;
      return;
    }

    const lastDistance = this.lastFirst.distance(this.lastSecond);
    const currDistance = first.distance(second);

    const diff = (lastDistance - currDistance) * 4;

    if (diff === 0) {
      return;
    }

    const pointBetween = first
      .getDirection(second)
      .multiply(0.5)
      .apply(first);

    this.lastFirst = first;
    this.lastSecond = second;

    this.runListeners(diff, pointBetween);
  };
}
