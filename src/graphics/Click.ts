import { DisplayObject, interaction } from 'pixi.js';

type Listener = (x: number, y: number) => void;

export default class Click {
  private readonly listeners: Listener[] = [];
  private clickStart?: { x: number; y: number };

  public constructor(private readonly stage: DisplayObject) {
    stage.on('pointerdown', event => {
      const { x, y } = event.data.global;
      this.clickStart = { x, y };
    });
    stage.on('pointerup', event => {
      if (!this.clickStart) {
        return;
      }
      const { x: x1, y: y1 } = event.data.global;
      const { x: x2, y: y2 } = this.clickStart!;
      if (x1 === x2 && y1 === y2) {
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
