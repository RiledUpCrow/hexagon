import { Container, Graphics } from 'pixi.js';
import Position from '../data/Position';
import DimensionsProvider from './DimensionsProvider';
import MapLayer from './MapLayer';

const SIZES = [4, 4.5, 5, 5.5, 6];
const DENSITY = 150;
const RADIUS = 6;

export default class BackgroundLayer implements MapLayer {
  protected background: Graphics | null = null;
  protected stars: { [size: number]: Container } = {};

  public constructor(
    protected readonly container: Container,
    protected readonly dp: DimensionsProvider
  ) {
    this.createBackground();
    SIZES.forEach(size => {
      this.stars[size] = this.generateStars(size * DENSITY);
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
      const { moveProgressX, moveProgressY } = this.getMoveProgress({ x, y });
      const { minX, maxX, minY, maxY } = this.getStarBoundaries();
      const mapWidth = maxX - minX;
      const mapHeight = maxY - minY;
      const starWidth = mapWidth / size;
      const starHeight = mapHeight / size;
      const maxXMove = starWidth - screenWidth;
      const maxYMove = starHeight - screenHeight;
      const moveX = maxXMove * moveProgressX;
      const moveY = maxYMove * moveProgressY;
      const positionX = -moveX;
      const positionY = -moveY;
      stars.position.set(positionX - x, positionY - y);
      stars.width = starWidth;
      stars.height = starHeight;
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

  protected getStarBoundaries = () => {
    const { scaleX, scaleY } = this.dp.getScale(
      this.dp.minSize,
      this.dp.maxSize
    );
    const {
      width: minWidth,
      height: minHeight,
    } = this.dp.getBorderDimensions();
    const borderWidth = minWidth * scaleX;
    const borderHeight = minHeight * scaleY;
    const { minX, maxX, minY, maxY } = this.dp.getMapBoundaries(
      this.dp.maxSize
    );
    const width = maxX - minX - minWidth * 2;
    const height = maxY - minY - minHeight * 2;
    return {
      minX: -(width + borderWidth),
      maxX: borderWidth,
      minY: -(height + borderHeight),
      maxY: borderHeight,
    };
  };

  public resize = () => undefined;

  public update = () => undefined;

  public animate = () => undefined;

  protected generateStars = (amount: number): Graphics => {
    const layer = new Graphics();
    const { minX, maxX, minY, maxY } = this.getStarBoundaries();
    const width = maxX - minX;
    const height = maxY - minY;
    for (let i = 0; i < amount; i++) {
      const randomX = Math.floor(Math.random() * width);
      const randomY = Math.floor(Math.random() * height);
      layer
        .beginFill(0xffffff, 0.5)
        .drawStar(randomX, randomY, 5, RADIUS, RADIUS * 2)
        .endFill();
    }
    return layer;
  };

  protected createBackground = () => {
    const { width, height } = this.dp.getScreen();
    if (this.background) {
      if (
        this.background.width === width &&
        this.background.height === height
      ) {
        return;
      }
      this.container.removeChild(this.background);
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
