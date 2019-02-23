import { DisplayObject, Ticker, interaction } from 'pixi.js';
import Point from './Point';
import Vector from './Vector';

type State =
  | 'idle'
  | 'touch'
  | 'primary'
  | 'secondary'
  | 'primaryDrag'
  | 'secondaryDrag'
  | 'inertia' // TODO: implement inertia somewhere else
  | 'zoom';

interface Options {
  minDistance: number;
  secondaryDelay: number;
  friction: number;
  timeWindow: number;
  speedTreshold: number;
  stopSpeed: number;
}

const defaultOptions: Options = {
  minDistance: 5,
  secondaryDelay: 500,
  friction: 0.95,
  timeWindow: 25,
  speedTreshold: 5,
  stopSpeed: 0.5,
};

interface MoveData {
  move: Vector;
  timestamp: number;
}

type ClickListener = (point: Point) => void;
type DragListener = (move: Vector) => void;
type ZoomListener = (zoom: number, center?: Point) => void;

interface Listeners {
  primary: ClickListener[];
  secondary: ClickListener[];
  primaryDrag: DragListener[];
  secondaryDrag: DragListener[];
  endPrimaryDrag: ClickListener[];
  endSecondaryDrag: ClickListener[];
  zoom: ZoomListener[];
}

export default class Controller {
  protected readonly options: Options;
  protected readonly listeners: Listeners = {
    primary: [],
    secondary: [],
    primaryDrag: [],
    secondaryDrag: [],
    endPrimaryDrag: [],
    endSecondaryDrag: [],
    zoom: [],
  };
  protected state: State = 'idle';

  protected point: Point = new Point(0, 0);
  protected moves: MoveData[] = [];
  protected lastA: Point | null = null;
  protected lastB: Point | null = null;
  protected delay = 0;
  protected velocity: Vector = new Vector(0, 0);
  protected start?: Point;

  public constructor(
    protected readonly ticker: Ticker,
    protected readonly displayObject: DisplayObject,
    options: Options = defaultOptions
  ) {
    this.options = { ...defaultOptions, ...options };
    document.addEventListener('wheel', this.handleWheel);
    displayObject.on('pointerdown', this.handleClick);
    displayObject.on('touchstart', this.handleTouch);
    displayObject.on('pointerup', this.handleRelease);
    displayObject.on('pointerupoutside', this.handleRelease);
    displayObject.on('pointercancel', this.handleRelease);
    displayObject.on('pointermove', this.handleMove);
    ticker.add(this.handleTick);
  }

  public registerPrimaryListener = (fn: ClickListener): Controller => {
    this.listeners.primary.push(fn);
    return this;
  };

  public registerSecondaryListener = (fn: ClickListener): Controller => {
    this.listeners.secondary.push(fn);
    return this;
  };

  public registerPrimaryDragListener = (fn: DragListener): Controller => {
    this.listeners.primaryDrag.push(fn);
    return this;
  };

  public registerSecondaryDragListener = (fn: DragListener): Controller => {
    this.listeners.secondaryDrag.push(fn);
    return this;
  };

  public registerEndPrimaryDragListener = (fn: ClickListener): Controller => {
    this.listeners.endPrimaryDrag.push(fn);
    return this;
  };

  public registerEndSecondaryDragListener = (fn: ClickListener): Controller => {
    this.listeners.endSecondaryDrag.push(fn);
    return this;
  };

  public registerZoomListener = (fn: ZoomListener): Controller => {
    this.listeners.zoom.push(fn);
    return this;
  };

  protected reset = () => {
    this.state = 'idle';
    this.delay = 0;
    this.moves = [];
    this.velocity = new Vector(0, 0);
    this.lastA = null;
    this.lastB = null;
    this.start = undefined;
  };

  protected startPrimary = (start: Point) => {
    this.state = 'primary';
    this.start = start;
  };

  protected startSecondary = (start: Point) => {
    this.state = 'secondary';
    this.start = start;
  };

  protected startTouch = (start: Point) => {
    this.state = 'touch';
    this.start = start;
  };

  protected startDrag = () => {
    this.state = 'primaryDrag';
  };

  protected startZoom = (a: Point, b: Point) => {
    this.state = 'zoom';
    this.lastA = a;
    this.lastB = b;
  };

  protected startInertia = () => {
    this.state = 'inertia';
  };

  protected handleClick = (event: interaction.InteractionEvent) => {
    this.point = Point.fromPixi(event.data.global);
    if (event.data.button === 0) {
      this.startPrimary(this.point);
    } else {
      this.startSecondary(this.point);
    }
  };

  protected handleTouch = (event: interaction.InteractionEvent) => {
    this.point = Point.fromPixi(event.data.global);
    const touches = (event.data.originalEvent as TouchEvent).targetTouches;
    if (touches.length === 1) {
      this.startTouch(this.point);
    } else if (touches.length === 2) {
      const a = new Point(touches[0].clientX, touches[0].clientY);
      const b = new Point(touches[1].clientX, touches[1].clientY);
      this.startZoom(a, b);
    } else {
      this.reset();
    }
  };

  protected handleRelease = () => {
    switch (this.state) {
      case 'primary':
      case 'touch': {
        this.runClickPrimary(this.start!);
        this.reset();
        break;
      }
      case 'secondary': {
        this.runClickSecondary(this.start!);
        this.reset();
        break;
      }
      case 'primaryDrag': {
        this.runEndDragPrimary(this.point);
        this.startInertia();
        break;
      }
      case 'secondaryDrag': {
        this.runEndDragSecondary(this.point);
        break;
      }
      default: {
        this.reset();
        break;
      }
    }
  };

  protected handleMove = (event: interaction.InteractionEvent) => {
    const newPoint = Point.fromPixi(event.data.global);
    const move = this.point.getDirection(newPoint);
    this.point = newPoint;

    const transformations: { [type: string]: State } = {
      touch: 'primaryDrag',
      primary: 'primaryDrag',
      secondary: 'secondaryDrag',
    };
    if (
      transformations[this.state] &&
      this.point.distance(this.start!) > this.options.minDistance
    ) {
      const state = this.state;
      this.reset();
      this.state = transformations[state];
    }

    if (this.state === 'primaryDrag') {
      this.pushMove(move);
      this.runDragPrimary(move);
    }

    if (this.state === 'secondaryDrag') {
      this.runDragSecondary(move);
    }

    if (this.state === 'zoom') {
      const touches = (event.data.originalEvent as TouchEvent).targetTouches;
      const newA = new Point(touches[0].clientX, touches[0].clientY);
      const newB = new Point(touches[1].clientX, touches[1].clientY);
      this.pinch(newA, newB);
    }
  };

  protected handleWheel = (event: WheelEvent) => {
    this.reset();
    event.preventDefault();
    const zoom = event.deltaY;
    this.runZoom(zoom, zoom > 0 ? undefined : this.point);
  };

  protected handleTick = (delta: number) => {
    if (this.state === 'touch') {
      this.delay += delta / 60;
      if (this.delay * 1000 >= this.options.secondaryDelay) {
        window.navigator.vibrate && window.navigator.vibrate(10);
        this.state = 'secondary';
        this.delay = 0;
      }
    }
    if (this.state === 'inertia') {
      this.updateVelocity();
      const { stopSpeed, friction } = this.options;
      if (this.velocity.length() < stopSpeed) {
        this.reset();
        return;
      }
      this.velocity = this.velocity.multiply(friction);
      this.runDragPrimary(this.velocity.multiply(delta));
    }
  };

  protected runClickPrimary = (point: Point) => {
    this.listeners.primary.forEach(fn => fn(point));
  };

  protected runClickSecondary = (point: Point) => {
    this.listeners.secondary.forEach(fn => fn(point));
  };

  protected runDragPrimary = (vector: Vector) => {
    this.listeners.primaryDrag.forEach(fn => fn(vector));
  };

  protected runDragSecondary = (vector: Vector) => {
    this.listeners.secondaryDrag.forEach(fn => fn(vector));
  };

  protected runEndDragPrimary = (point: Point) => {
    this.listeners.endPrimaryDrag.forEach(fn => fn(point));
  };

  protected runEndDragSecondary = (point: Point) => {
    this.listeners.endSecondaryDrag.forEach(fn => fn(point));
  };

  protected runZoom = (zoom: number, point?: Point) => {
    this.listeners.zoom.forEach(fn => fn(zoom, point));
  };

  public stop = () => {
    document.removeEventListener('wheel', this.handleWheel);
    this.displayObject.off('mousedown', this.handleClick);
    this.displayObject.off('touchstart', this.handleTouch);
    this.displayObject.off('pointerup', this.handleRelease);
    this.displayObject.off('pointerupoutside', this.handleRelease);
    this.displayObject.off('pointercancel', this.handleRelease);
    this.displayObject.off('pointermove', this.handleMove);
    this.ticker.remove(this.handleTick);
  };

  private pushMove = (move: Vector) => {
    const now = new Date().getTime();
    const newMoves = [{ move, timestamp: now }];
    for (let i = 0; i < this.moves.length; i++) {
      newMoves.push(this.moves[i]);
      if (now - this.moves[i].timestamp > this.options.timeWindow) {
        break;
      }
    }
    this.moves = newMoves;
  };

  private pinch = (newA: Point, newB: Point) => {
    const lastDistance = this.lastA!.distance(this.lastB!);
    const currDistance = newA.distance(newB);

    const diff = (lastDistance - currDistance) * 4;
    if (diff === 0) {
      return;
    }

    const pointBetween = newA
      .getDirection(newB)
      .multiply(0.5)
      .apply(newA);

    this.lastA = newA;
    this.lastB = newB;

    this.runZoom(diff, pointBetween);
  };

  private updateVelocity = () => {
    let xSum = 0;
    let ySum = 0;

    let time = 0;
    let lastTimestamp: number | null = null;
    let firstTimestamp: number | null = null;

    const { timeWindow, speedTreshold } = this.options;

    this.moves.forEach(moveData => {
      const { move, timestamp } = moveData;

      if (!lastTimestamp) {
        lastTimestamp = timestamp;
      }
      if (!firstTimestamp) {
        firstTimestamp = timestamp;
      }
      const delay = timestamp - lastTimestamp;
      const totalElapsed = new Date().getTime() - firstTimestamp;
      lastTimestamp = timestamp;
      if (totalElapsed > timeWindow) {
        return;
      }

      const { x, y } = move;
      xSum += x;
      ySum += y;
      time += delay;
    });

    const frameDuration = 1000 / 60;

    if (time === 0) {
      return;
    }

    const xAvgPerFrame = (xSum / time) * frameDuration;
    const yAvgPerFrame = (ySum / time) * frameDuration;

    const velocity = new Vector(-xAvgPerFrame, -yAvgPerFrame);

    if (velocity.length() < speedTreshold) {
      return;
    }

    this.velocity = velocity;
  };
}
