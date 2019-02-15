import { DisplayObject } from 'pixi.js';

export default interface MapLayer {
  draw: (refresh: boolean) => DisplayObject;
}
