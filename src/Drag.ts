import { DisplayObject, ticker } from "pixi.js";
import Point from "./Point";
import Vector from "./Vector";

type Listener = (x: number, y: number) => void;

interface MoveData {
  move: Vector;
  timestamp: number;
}

interface Options {
  friction: number;
  timeWindow: number;
  speedTreshold: number;
  stopSpeed: number;
}

const defaultOptions: Options = {
  friction: 0.95,
  timeWindow: 50,
  speedTreshold: 5,
  stopSpeed: 0.5
};

class Drag {
  private down: boolean = false;
  private moves: MoveData[] = [];
  private lastPoint: Point | null = null;
  private velocity: Vector = new Vector(0, 0);
  private readonly listeners: Listener[] = [];
  private readonly options: Options;

  constructor(
    private readonly ticker: ticker.Ticker,
    private readonly displayObject: DisplayObject,
    options: Partial<Options> = defaultOptions
  ) {
    this.options = { ...defaultOptions, ...options };
    const { friction, stopSpeed } = this.options;
    displayObject.on("pointerdown", event => {
      this.down = true;
      const { x, y } = event.data.global;
      this.lastPoint = new Point(x, y);
      this.velocity = new Vector(0, 0);
      this.moves = [];
    });
    displayObject.on("pointerup", () => {
      this.down = false;
      this.updateVelocity();
      this.moves = [];
    });
    displayObject.on("pointermove", event => {
      if (!this.down) {
        return;
      }
      const { x, y } = event.data.global;
      const newPoint = new Point(x, y);
      const move = this.calculateMove(newPoint);
      this.lastPoint = newPoint;
      this.runListeners(move);
    });
    ticker.add(deltaTime => {
      if (this.velocity.length() < stopSpeed) {
        return;
      }
      this.velocity = this.velocity.multiply(friction);
      this.runListeners(this.velocity.multiply(deltaTime));
    });
  }

  public addListener = (fn: Listener): void => {
    this.listeners.push(fn);
  };

  public removeListener = (fn: Listener): void => {
    const index = this.listeners.indexOf(fn);
    if (index >= 0) {
      this.listeners.splice(index, 1);
    }
  };

  private runListeners = ({ x, y }: Vector): void => {
    if (x === 0 && y === 0) {
      return;
    }
    this.listeners.forEach(fn => fn(x, y));
  };

  private calculateMove = (newPoint: Point): Vector => {
    const x = newPoint.x - this.lastPoint!.x;
    const y = newPoint.y - this.lastPoint!.y;
    const move = new Vector(x, y);
    this.pushMove(move);
    return move;
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
}

export default Drag;
