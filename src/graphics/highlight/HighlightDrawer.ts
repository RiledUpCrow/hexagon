import { Highlight } from '../../data/Highlight';
import { DisplayObject } from 'pixi.js';

export default interface HighlightDrawer {
  draw: (highligh: Highlight) => DisplayObject;
}
