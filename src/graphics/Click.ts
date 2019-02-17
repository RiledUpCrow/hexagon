import { DisplayObject, interaction } from 'pixi.js';
import Point from './Point';

type Listener = (x: number, y: number) => void;

const THRESHOLD = 5;

export default class Click {
  private readonly listeners: Listener[] = [];
  private clickStart?: Point;

  public constructor(private readonly stage: DisplayObject) {
    stage.on('pointerdown', event => {
      this.clickStart = Point.fromPixi(event.data.global);
    });
    stage.on('pointerup', event => {
      if (!this.clickStart) {
        return;
      }
      const clickEnd = Point.fromPixi(event.data.global);
      if (this.clickStart.distance(clickEnd) < THRESHOLD) {
        this.runListeners(event);
      }
    });
  }

  public addListener = (fn: Listener): Click => {
    this.listeners.push(fn);
    return this;
  };

  public stop = () => {
    this.stage.off('click', this.runListeners);
  };

  private runListeners = (event: interaction.InteractionEvent) => {
    this.listeners.forEach(fn => fn(event.data.global.x, event.data.global.y));
  };
}
