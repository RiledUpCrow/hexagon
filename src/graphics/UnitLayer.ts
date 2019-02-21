import MapLayer from './MapLayer';
import { DisplayObject, Container } from 'pixi.js';
import { UnitState } from '../store/reducers/unitReducer';
import DimensionsProvider from './DimensionsProvider';
import TextureManager from './TextureManager';
import Unit from '../data/Unit';
import Point from './Point';
import { Position } from '../userInterface/TileInfo';
import { MovementState } from '../store/reducers/movementReducer';
import { RootState } from '../store/reducers';

interface RenderedUnit {
  unit: Unit;
  displayObject?: DisplayObject;
  drawn: boolean;
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
  protected readonly units: () => UnitState;
  protected readonly moves: () => MovementState;
  protected readonly renderedUnits: RenderedUnitList = {};
  protected previousUnits: UnitState;
  protected previousMoves: MovementState;

  public constructor(
    protected readonly container: Container,
    protected readonly textureManager: TextureManager,
    protected readonly getState: () => RootState,
    protected readonly dp: DimensionsProvider
  ) {
    this.units = () => getState().units;
    this.moves = () => getState().movement;
    this.previousUnits = this.units();
    this.previousMoves = this.moves();
    Object.keys(this.previousUnits).forEach(id => {
      const unit = this.previousUnits[Number(id)];
      this.renderedUnits[Number(id)] = { unit, animation: [], drawn: false };
    });
  }

  public draw = (): void => {
    Object.keys(this.renderedUnits).forEach(id => {
      const unit = this.renderedUnits[Number(id)];
      if (this.isHidden(unit)) {
        this.hideUnit(unit);
      } else {
        this.showUnit(unit);
      }
    });
  };

  public resize = (): void => {
    this.clear();
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
      const renderedUnit = {
        unit: currentUnits[Number(id)],
        animation: [],
        drawn: false,
      };
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
      this.renderedUnits[id].unit = curr;
      this.removeUnit(this.renderedUnits[id]);
      this.renderUnit(this.renderedUnits[id]);
    });

    const currentMoves = this.moves();
    if (currentMoves && currentMoves !== this.previousMoves) {
      const { unit, movement } = currentMoves;
      const pos = unit.position;
      for (let i = 0; i < movement.length; i++) {
        const move = movement[i];
        this.renderedUnits[unit.id].animation.push({
          start: Point.fromPosition(pos),
          end: Point.fromPosition(move),
          progress: 0,
        });
      }
    }

    this.previousMoves = currentMoves;
    this.previousUnits = currentUnits;

    this.draw();
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
    this.draw();
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
    unit.drawn = false;
  };

  protected renderUnit = (unit: RenderedUnit) => {
    if (unit.displayObject) {
      return;
    }

    const sprite = this.textureManager.getUnitType(
      unit.unit.type,
      this.dp.getTileDimensions().width * 0.5
    );
    const { x, y } = this.getCurrentPosition(unit);
    sprite.position.set(x, y);
    sprite.anchor.y = 0.75;
    unit.displayObject = sprite;
  };

  protected hideUnit = (unit: RenderedUnit) => {
    if (!unit.drawn) {
      return;
    }
    this.container.removeChild(unit.displayObject!);
    unit.drawn = false;
  };

  protected showUnit = (unit: RenderedUnit) => {
    if (unit.drawn) {
      return;
    }
    if (!unit.displayObject) {
      this.renderUnit(unit);
    }
    this.container.addChild(unit.displayObject!);
    unit.drawn = true;
  };

  private getCurrentPosition = (unit: RenderedUnit): Position => {
    return unit.animation.length > 0
      ? this.getAnimatedPosition(unit.animation[0])
      : this.getStaticPosition(unit.unit);
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
