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
    if (this.background) {
      this.container.removeChild(this.background);
    }
    const { minX, maxX, minY, maxY } = this.dp.getViewBoundaries();
    this.background = new Graphics()
      .beginFill(0x13062d)
      .moveTo(minX, minY)
      .lineTo(maxX, minY)
      .lineTo(maxX, maxY)
      .lineTo(minX, maxY)
      .closePath()
      .endFill();
    this.container.addChildAt(this.background, 0);

    return this.container;
  };

  public update = () => undefined;
}
