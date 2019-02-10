import { Application, Container } from 'pixi.js';
import Settings from '../data/Settings';
import DimensionsProvider from './DimensionsProvider';
import Drag from './Drag';
import Drawer from './Drawer';
import FpsCounter from './FpsCounter';
import { DefaultMap } from './Map';
import TextureManager from './TextureManager';
import TileRenderer from './TileRenderer';
import Zoom from './Zoom';

type Kill = () => void;

const launch = (
  { mapWidth, mapHeight, maxZoom, minZoom, size }: Settings,
  div: HTMLElement,
  onReady: () => void
): Kill => {
  const app = new Application({
    autoDensity: true,
    resolution: devicePixelRatio,
    width: div.clientWidth,
    height: div.clientHeight,
    resizeTo: div,
  });

  const textureManager = new TextureManager(app.loader, app.renderer);

  const setup = (): (() => void) => {
    const container = new Container();
    app.stage.addChild(container);
    app.stage.interactive = true;

    const dp = new DimensionsProvider();
    const tileRenderer = new TileRenderer(textureManager, dp);
    const map = new DefaultMap(mapWidth, mapHeight);
    const drawer = new Drawer(
      tileRenderer,
      container,
      map,
      dp,
      div.clientWidth,
      div.clientHeight,
      size,
      maxZoom,
      minZoom
    );

    const drag = new Drag(app.ticker, app.stage).addListener((x, y) =>
      drawer.moveMapBy(x, y)
    );
    const zoom = new Zoom(app.stage).addListener((zoom, point) =>
      drawer.zoom(zoom, point)
    );
    const counter = new FpsCounter(app);

    const resize = (): void => {
      app.renderer.resize(div.clientWidth, div.clientHeight);
      drawer.resize(div.clientWidth, div.clientHeight);
    };
    window.addEventListener('resize', resize);
    resize();

    const tearDown = (): void => {
      window.removeEventListener('resize', resize);
      drag.stop();
      zoom.stop();
      counter.stop();
      app.stage.removeChildren();
      container.destroy();
    };

    onReady();

    return tearDown;
  };

  const loaded = textureManager.load().then(setup);

  div.appendChild(app.view);

  return () => {
    loaded.then(tearDown => {
      tearDown();
      textureManager.cleanup();
      div.removeChild(app.view);
      app.destroy();
    });
  };
};

export default launch;
