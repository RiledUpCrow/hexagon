import { Container, DisplayObject } from 'pixi.js';
import { Highlight, HighlightType } from '../data/Highlight';
import { RootState } from '../store/reducers';
import DimensionsProvider from './DimensionsProvider';
import RangeDrawer from './highlight/RangeDrawer';
import MapLayer from './MapLayer';
import TextureManager from './TextureManager';
import HighlightDrawer from './highlight/HighlightDrawer';

export default class UnderlayLayer implements MapLayer {
  protected readonly highlights: () => Highlight[];
  protected readonly renderedHighlights: { [id: number]: DisplayObject } = {};
  protected readonly drawers: { [K in HighlightType]: HighlightDrawer };
  protected previousHighlights: Highlight[];

  public constructor(
    protected readonly container: Container,
    protected readonly textureManager: TextureManager,
    protected readonly getState: () => RootState,
    protected readonly dp: DimensionsProvider
  ) {
    this.highlights = () => getState().highlight;
    this.previousHighlights = this.highlights();
    this.drawers = { range: new RangeDrawer(dp) };
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

  public animate = (): void => {};

  protected renderHighlight = (highlight: Highlight): void => {
    if (this.renderedHighlights[highlight.id]) {
      return;
    }
    const obj = this.drawers.range.draw(highlight);
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
