import { DisplayObject, interaction } from 'pixi.js';
import Point from './Point';

type Type = 'primary' | 'secondary';

type Listener = (x: number, y: number) => void;

const THRESHOLD = 5;

export default class Click {
  private readonly primary: Listener[] = [];
  private readonly secondary: Listener[] = [];
  private type?: Type;
  private clickStart?: Point;

  public constructor(private readonly stage: DisplayObject) {
    stage.on('pointerdown', event => {
      this.type = event.data.button === 0 ? 'primary' : 'secondary';
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

  public addListener = (fn: Listener, type: Type = 'primary'): Click => {
    if (type === 'primary') {
      this.primary.push(fn);
    } else {
      this.secondary.push(fn);
    }
    return this;
  };

  public stop = () => {
    this.stage.off('click', this.runListeners);
  };

  private runListeners = (event: interaction.InteractionEvent) => {
    if (this.type === 'primary') {
      this.primary.forEach(fn => fn(event.data.global.x, event.data.global.y));
    } else {
      this.secondary.forEach(fn =>
        fn(event.data.global.x, event.data.global.y)
      );
    }
  };
}
