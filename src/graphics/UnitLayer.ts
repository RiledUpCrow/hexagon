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
  animation: UnitAnimation[];
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
  protected previousUnits: UnitState;

  public constructor(
    protected readonly container: Container,
    protected readonly textureManager: TextureManager,
    protected readonly units: () => UnitState,
    protected readonly dp: DimensionsProvider
  ) {
    const unitsSnap = units();
    this.previousUnits = unitsSnap;
    Object.keys(unitsSnap).forEach(id => {
      const unit = unitsSnap[Number(id)];
      this.renderedUnits[Number(id)] = { unit, animation: [] };
    });
  }

  public draw = (refresh: boolean): void => {
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
  };

  public update = (): void => {
    const currentUnits = this.units();
    if (currentUnits === this.previousUnits) {
      return;
    }
    const currentIds = Object.keys(currentUnits);
    const previousIds = Object.keys(this.previousUnits);

    const added = currentIds.filter(
      id => previousIds.indexOf(id) === undefined
    );
    added.forEach(id => {
      const renderedUnit = { unit: currentUnits[Number(id)], animation: [] };
      this.renderedUnits[Number(id)] = renderedUnit;
      this.renderUnit(renderedUnit);
    });

    const removed = previousIds.filter(
      id => currentIds.indexOf(id) === undefined
    );
    removed.forEach(id => {
      const renderedUnit = this.renderedUnits[Number(id)];
      this.removeUnit(renderedUnit);
      delete this.renderedUnits[Number(id)];
    });

    const changed = previousIds.filter(
      id =>
        currentUnits[Number(id)] &&
        this.previousUnits[Number(id)] !== currentUnits[Number(id)]
    );
    changed.forEach(key => {
      const id = Number(key);
      const curr = currentUnits[id];
      const prev = this.previousUnits[id];
      if (!Object.is(curr.position, prev.position)) {
        const animation: UnitAnimation = {
          start: new Point(prev.position.x, prev.position.y),
          end: new Point(curr.position.x, curr.position.y),
          progress: 0,
        };
        this.renderedUnits[id].animation.push(animation);
        this.draw(false);
      }
      this.renderedUnits[id].unit = curr;
    });

    this.previousUnits = currentUnits;
  };

  public animate = (): void => {
    const progress = 3 / 60;
    Object.keys(this.renderedUnits).forEach(key => {
      const id = Number(key);
      const unit = this.renderedUnits[id];
      if (unit.animation.length > 0) {
        const animation = unit.animation[0];
        if (animation.progress >= 1) {
          unit.animation.splice(0, 1);
          return;
        }
        animation.progress += progress;
        if (unit.displayObject) {
          const { x, y } = this.getAnimatedPosition(animation);
          unit.displayObject.position.set(x, y);
        }
      }
    });
    this.draw(false);
  };

  protected clear = () => {
    Object.keys(this.renderedUnits).forEach(id => {
      const unit = this.renderedUnits[Number(id)];
      this.removeUnit(unit);
    });
  };

  protected isHidden = (unit: RenderedUnit): boolean => {
    if (unit.animation.length > 0) {
      // there's an animation, let's check if entire rectangle of movement is hidden
      const animation = unit.animation[0];
      const { x: startX, y: startY } = animation.start;
      const { x: endX, y: endY } = animation.end;
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
    const { x, y } =
      unit.animation.length > 0
        ? this.getAnimatedPosition(unit.animation[0])
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

  private getAnimatedPosition = (animation: UnitAnimation): Position => {
    const { start, end } = animation;
    const { x: startX, y: startY } = this.dp.getTileCoordinates(
      start.x,
      start.y
    );
    const { x: endX, y: endY } = this.dp.getTileCoordinates(end.x, end.y);
    const startPoint = new Point(startX, startY);
    const endPoint = new Point(endX, endY);
    const distance = (Math.cos(Math.PI * animation.progress) - 1) / -2;
    const direction = startPoint.getDirection(endPoint).multiply(distance);
    return startPoint.add(direction);
  };

  private isTileHidden = (xIndex: number, yIndex: number) => {
    const { minX, maxX, minY, maxY } = this.dp.getTileIndexBoundaries();
    return xIndex < minX || xIndex > maxX || yIndex < minY || yIndex > maxY;
  };
}
