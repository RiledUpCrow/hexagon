import { Container, Graphics } from 'pixi.js';
import DimensionsProvider from './DimensionsProvider';
import MapLayer from './MapLayer';

const SIZES = [3, 3.5, 4, 4.5, 5];

export default class BackgroundLayer implements MapLayer {
  protected background: Graphics | null = null;
  protected stars: { [size: number]: Container } = {};

  public constructor(
    protected readonly container: Container,
    protected readonly dp: DimensionsProvider
  ) {
    this.createBackground();
    SIZES.forEach(size => {
      this.stars[size] = this.generateStars(1000);
      this.container.addChild(this.stars[size]);
    });
  }

  public draw = () => {
    this.createBackground();
    const { x, y } = this.dp.getPosition();
    this.background!.position.set(-x, -y);
    SIZES.forEach(size => {
      const stars = this.stars[size];
      const { width: screenWidth, height: screenHeight } = this.dp.getScreen();
      const { minX, maxX, minY, maxY } = this.dp.getMapBoundaries();
      const width = maxX - minX;
      const height = maxY - minY;
      const scaleX = 1 - (x - minX) / width;
      const scaleY = 1 - (y - minY) / height;
      const maxXMove = width - width / size;
      const maxYMove = height - height / size;
      const moveX = maxXMove * scaleX;
      const moveY = maxYMove * scaleY;
      stars.position.set(-maxX + moveX, -maxY + moveY);
      stars.width = width / size + screenWidth;
      stars.height = height / size + screenHeight;
    });
  };

  public resize = () => undefined;

  public update = () => undefined;

  public animate = () => undefined;

  protected generateStars = (amount: number): Graphics => {
    const layer = new Graphics();
    const { width: screenWidth, height: screenHeight } = this.dp.getScreen();
    const { minX, maxX, minY, maxY } = this.dp.getMapBoundaries();
    const width = maxX - minX + screenWidth;
    const height = maxY - minY + screenHeight;
    for (let i = 0; i < amount; i++) {
      const randomX = Math.floor(Math.random() * width);
      const randomY = Math.floor(Math.random() * height);
      layer
        .beginFill(0xffffff, 0.5)
        .drawCircle(randomX, randomY, 4)
        .endFill();
    }
    // layer
    //   .lineStyle(8, 0xffffff)
    //   .drawRect(8, 8, width - 8, height - 8)
    //   .endFill();
    return layer;
  };

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
}
