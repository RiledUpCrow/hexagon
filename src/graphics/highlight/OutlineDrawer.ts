import HighlightDrawer from './HighlightDrawer';
import DimensionsProvider from '../DimensionsProvider';
import TextureManager from '../TextureManager';
import { DisplayObject, Container } from 'pixi.js';
import { Highlight } from '../../data/Highlight';

export default class OutlineDrawer implements HighlightDrawer {
  public constructor(
    protected readonly dp: DimensionsProvider,
    protected readonly textureManager: TextureManager
  ) {}

  public draw = (highlight: Highlight): DisplayObject => {
    if (highlight.type !== 'outline') {
      throw new Error('Incorrect highlight type');
    }
    const { width } = this.dp.getTileDimensions();
    const area = new Container();
    highlight.tiles.forEach(tile => {
      const { x, y } = this.dp.getTileCoordinates(tile.x, tile.y);
      const [obj] = this.textureManager.getCustom('HIGHLIGHT', width);
      obj.tint = highlight.color;
      obj.position.set(x, y);
      obj.width *= 0.98;
      obj.height *= 0.98;
      area.addChild(obj);
    });
    return area;
  };
}
