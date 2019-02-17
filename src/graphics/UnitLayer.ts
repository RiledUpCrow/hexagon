import MapLayer from './MapLayer';
import { DisplayObject, Container } from 'pixi.js';
import { UnitState } from '../store/reducers/unitReducer';
import DimensionsProvider from './DimensionsProvider';
import TextureManager from './TextureManager';
import Unit from '../data/Unit';
import Point from './Point';
import { Position } from '../userInterface/TileInfo';

interface RenderedUnit {
  unit: Unit;
  displayObject?: DisplayObject;
  animation?: UnitAnimation;
}

interface UnitAnimation {
  start: Point;
  end: Point;
  progress: number;
}

interface RenderedUnitList {
  [id: number]: RenderedUnit;
}

export default class UnitLayer implements MapLayer {
  protected readonly renderedUnits: RenderedUnitList = {};

  public constructor(
    protected readonly container: Container,
    protected readonly textureManager: TextureManager,
    protected readonly units: () => UnitState,
    protected readonly dp: DimensionsProvider
  ) {
    const unitsSnap = units();
    Object.keys(unitsSnap).forEach(id => {
      const unit = unitsSnap[Number(id)];
      this.renderedUnits[Number(id)] = { unit };
    });
  }

  public draw = (refresh: boolean): DisplayObject => {
    if (refresh) {
      this.clear();
    }

    Object.keys(this.renderedUnits).forEach(id => {
      const unit = this.renderedUnits[Number(id)];
      if (this.isHidden(unit)) {
        this.removeUnit(unit);
      } else {
        this.renderUnit(unit);
      }
    });

    return this.container;
  };

  public update = (): void => {};

  protected clear = () => {
    Object.keys(this.renderedUnits).forEach(id => {
      const unit = this.renderedUnits[Number(id)];
      this.removeUnit(unit);
    });
  };

  protected isHidden = (unit: RenderedUnit): boolean => {
    if (unit.animation) {
      // there's an animation, let's check if entire rectangle of movement is hidden
      const { x: startX, y: startY } = unit.animation.start;
      const { x: endX, y: endY } = unit.animation.end;
      return [
        this.isTileHidden(Math.min(startX, endX), Math.min(startY, endY)),
        this.isTileHidden(Math.min(startX, endX), Math.max(startY, endY)),
        this.isTileHidden(Math.max(startX, endX), Math.min(startY, endY)),
        this.isTileHidden(Math.max(startX, endX), Math.max(startY, endY)),
      ].every(b => b);
    } else {
      // unit is stationary, check only its tile
      const { x, y } = unit.unit.position;
      return this.isTileHidden(x, y);
    }
  };

  protected removeUnit = (unit: RenderedUnit) => {
    if (!unit.displayObject) {
      return;
    }
    this.container.removeChild(unit.displayObject);
    unit.displayObject = undefined;
  };

  protected renderUnit = (unit: RenderedUnit) => {
    if (unit.displayObject) {
      return;
    }

    const sprite = this.textureManager.getUnitType(
      unit.unit.type,
      this.dp.getTileDimensions().width * 0.5
    );
    const { x, y } = unit.animation
      ? this.getAnimaterPosition(unit.animation)
      : this.getStaticPosition(unit.unit);
    sprite.position.set(x, y);
    sprite.anchor.y = 0.75;
    this.container.addChild(sprite);
    unit.displayObject = sprite;
  };

  private getStaticPosition = (unit: Unit): Position => {
    const { x, y } = unit.position;
    return this.dp.getTileCoordinates(x, y);
  };

  private getAnimaterPosition = (animation: UnitAnimation): Position => {
    const { start, end } = animation;
    const startPoint = new Point(start.x, start.y);
    const endPoint = new Point(end.x, end.y);
    const direction = startPoint
      .getDirection(endPoint)
      .multiply(animation.progress);
    return start.add(direction);
  };

  private isTileHidden = (xIndex: number, yIndex: number) => {
    const { minX, maxX, minY, maxY } = this.dp.getTileIndexBoundaries();
    return xIndex < minX || xIndex > maxX || yIndex < minY || yIndex > maxY;
  };
}
