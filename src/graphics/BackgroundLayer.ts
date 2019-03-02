import { Container, Graphics } from 'pixi.js';
import DimensionsProvider from './DimensionsProvider';
import MapLayer from './MapLayer';

export default class BackgroundLayer implements MapLayer {
  private background: Container | null = null;

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

  public update = () => undefined;

  public animate = () => undefined;

  protected createBackground = () => {
    const { width, height } = this.dp.getScreen();
    if (
      this.background &&
      this.background.width === width &&
      this.background.height === height
    ) {
      return;
    }
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
