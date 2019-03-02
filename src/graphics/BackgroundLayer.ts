import { Container, Graphics } from 'pixi.js';
import DimensionsProvider from './DimensionsProvider';
import MapLayer from './MapLayer';
import { Position } from '../userInterface/TileInfo';

const SIZES = [1.5, 1.75, 2, 2.25, 2.5];

export default class BackgroundLayer implements MapLayer {
  protected background: Graphics | null = null;
  protected stars: { [size: number]: Container } = {};

  public constructor(
    protected readonly container: Container,
    protected readonly dp: DimensionsProvider
  ) {
    this.createBackground();
    SIZES.forEach(size => {
      this.stars[size] = this.generateStars(500);
      this.container.addChild(this.stars[size]);
    });
  }

  public draw = () => {
    this.createBackground();
    const { x, y } = this.dp.getPosition();
    this.background!.position.set(-x, -y);
    SIZES.forEach(size => {
      const stars = this.stars[size];
      const { moveProgressX, moveProgressY } = this.getMoveProgress({ x, y });
      const { width: screenWidth, height: screenHeight } = this.dp.getScreen();
      const maxXMove = screenWidth - screenWidth / size;
      const maxYMove = screenHeight - screenHeight / size;
      const moveX = maxXMove * moveProgressX;
      const moveY = maxYMove * moveProgressY;
      stars.position.set(-moveX * size - x, -moveY * size - y);
      stars.width = screenWidth * size;
      stars.height = screenHeight * size;
    });
  };

  protected getMoveProgress = (position: Position) => {
    const { x, y } = position;
    const { minX, maxX, minY, maxY } = this.dp.getMapBoundaries();
    const width = maxX - minX;
    const height = maxY - minY;
    const moveProgressX = 1 - (x - minX) / width;
    const moveProgressY = 1 - (y - minY) / height;
    return { moveProgressX, moveProgressY };
  };

  public resize = () => undefined;

  public update = () => undefined;

  public animate = () => undefined;

  protected generateStars = (amount: number): Graphics => {
    const starSize = 8;
    const layer = new Graphics();
    const { width, height } = this.dp.getScreen();
    for (let i = 0; i < amount; i++) {
      const randomX = Math.floor(Math.random() * width * starSize);
      const randomY = Math.floor(Math.random() * height * starSize);
      layer
        .beginFill(0xffffff, 0.5)
        .drawCircle(randomX, randomY, 4)
        .endFill();
    }
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
