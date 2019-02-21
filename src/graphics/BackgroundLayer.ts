import MapLayer from './MapLayer';
import { Container, Graphics, DisplayObject } from 'pixi.js';
import DimensionsProvider from './DimensionsProvider';

export default class BackgroundLayer implements MapLayer {
  private background: DisplayObject | null = null;

  public constructor(
    protected readonly container: Container,
    protected readonly dp: DimensionsProvider
  ) {}

  public draw = () => {
    this.createBackground();
    const { x, y } = this.dp.getPosition();
    this.background!.position.set(-x, -y);
  };

  public resize = () => undefined;

  public update = () => {
    this.removeBackground();
    this.draw();
  };

  public animate = () => undefined;

  protected createBackground = () => {
    if (this.background) {
      return;
    }
    const { width, height } = this.dp.getScreen();
    this.background = new Graphics()
      .beginFill(0x13062d)
      .moveTo(0, 0)
      .lineTo(width, 0)
      .lineTo(width, height)
      .lineTo(0, height)
      .closePath()
      .endFill();
    this.container.addChildAt(this.background, 0);
  };

  protected removeBackground = () => {
    if (!this.background) {
      return;
    }
    this.container.removeChild(this.background);
    this.background = null;
  };
}
