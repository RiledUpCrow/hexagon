import { Container, DisplayObject } from 'pixi.js';
import { Highlight, HighlightType } from '../data/Highlight';
import { RootState } from '../store/reducers';
import DimensionsProvider from './DimensionsProvider';
import RangeDrawer from './highlight/RangeDrawer';
import MapLayer from './MapLayer';
import TextureManager from './TextureManager';
import HighlightDrawer from './highlight/HighlightDrawer';
import OutlineDrawer from './highlight/OutlineDrawer';

export default class UnderlayLayer implements MapLayer {
  protected readonly highlights: () => Highlight[];
  protected readonly renderedHighlights: { [id: number]: DisplayObject } = {};
  protected readonly drawers: { [K in HighlightType]: HighlightDrawer };
  protected previousHighlights: Highlight[];
  protected counter = 0;

  public constructor(
    protected readonly container: Container,
    protected readonly textureManager: TextureManager,
    protected readonly getState: () => RootState,
    protected readonly dp: DimensionsProvider
  ) {
    this.highlights = () => getState().highlight;
    this.previousHighlights = this.highlights();
    this.drawers = {
      range: new RangeDrawer(dp),
      outline: new OutlineDrawer(dp, textureManager),
    };
  }

  public draw = (): void => {
    const highlights = this.highlights();
    highlights.forEach(highlight => {
      this.renderHighlight(highlight);
    });
  };

  public resize = (): void => {
    const highlights = this.highlights();
    highlights.forEach(highlight => {
      this.removeHighlight(highlight);
    });
  };

  public update = (): void => {
    const currentHighlights = this.highlights();
    if (currentHighlights === this.previousHighlights) {
      return;
    }
    this.previousHighlights.forEach(h => this.removeHighlight(h));
    currentHighlights.forEach(h => this.renderHighlight(h));
    this.previousHighlights = currentHighlights;
  };

  public animate = (): void => {
    this.counter++;
    Object.keys(this.renderedHighlights).forEach(key => {
      const area = this.renderedHighlights[Number(key)];
      area.alpha = (Math.sin(this.counter / 15) + 1) * 0.125 + 0.5;
    });
  };

  protected renderHighlight = (highlight: Highlight): void => {
    if (this.renderedHighlights[highlight.id]) {
      return;
    }
    const obj = this.drawers[highlight.type].draw(highlight);
    this.renderedHighlights[highlight.id] = obj;
    this.container.addChild(obj);
  };

  protected removeHighlight = (highlight: Highlight): void => {
    if (!this.renderedHighlights[highlight.id]) {
      return;
    }
    this.container.removeChild(this.renderedHighlights[highlight.id]);
    delete this.renderedHighlights[highlight.id];
  };
}
