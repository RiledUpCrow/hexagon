import { Application, Container } from 'pixi.js';
import { Store } from 'redux';
import Map from '../data/Map';
import Settings from '../data/Settings';
import { RESET, SELECT_TILE, UPDATE_TILE } from '../store/actions';
import { RootState } from '../store/reducers';
import BackgroundLayer from './BackgroundLayer';
import Click from './Click';
import DimensionsProvider from './DimensionsProvider';
import Drag from './Drag';
import FpsCounter from './FpsCounter';
import MapDrawer from './MapDrawer';
import TextureManager from './TextureManager';
import TileLayer from './TileLayer';
import TileRenderer from './TileRenderer';
import Zoom from './Zoom';
import { Position } from '../userInterface/TileInfo';

type Kill = () => void;

const app = new Application({
  autoDensity: true,
  resolution: devicePixelRatio,
  width: window.innerWidth,
  height: window.innerHeight,
});

const textureManager = new TextureManager(app.loader, app.renderer);

const launch = (
  { mapWidth, mapHeight, maxZoom, minZoom, size }: Settings,
  div: HTMLElement,
  onReady: () => void,
  store: Store<RootState>
): Kill => {
  const setup = (): (() => void) => {
    const container = new Container();
    app.stage.addChild(container);
    app.stage.interactive = true;

    const dp = new DimensionsProvider();
    const tileRenderer = new TileRenderer(textureManager, dp);
    const map = (): Map => store.getState().map!;
    const backgroundLayer = new BackgroundLayer(new Container(), dp);
    const tileLayer = new TileLayer(new Container(), tileRenderer, map, dp);
    const drawer = new MapDrawer(
      [backgroundLayer, tileLayer],
      container,
      map,
      dp,
      size,
      div.clientWidth,
      div.clientHeight,
      minZoom,
      maxZoom
    );

    let previousMap = map();
    const storeUnsubscribe = store.subscribe(() => {
      const currentMap = map();
      if (currentMap !== previousMap) {
        const changed: Position[] = [];
        const { tiles, width, height } = currentMap;
        for (let x = 0; x < width; x++) {
          for (let y = 0; y < height; y++) {
            if (previousMap.tiles[x][y] !== tiles[x][y]) {
              changed.push({ x, y });
            }
          }
        }
        changed.forEach(position => tileLayer.updateTile(position));
      }
      previousMap = currentMap;
    });

    const click = new Click(app.stage).addListener((x, y) => {
      const local = dp.toLocalPoint({ x, y });
      const hex = dp.toHex(local);
      if (hex.x < 0 || hex.x >= mapWidth || hex.y < 0 || hex.y >= mapHeight) {
        return;
      }
      const tile = map().tiles[hex.x][hex.y];
      if (!tile) {
        return;
      }
      store.dispatch({ type: SELECT_TILE, tile, position: hex });
      // TODO remove this ⬇
      store.dispatch({
        type: UPDATE_TILE,
        x: hex.x,
        y: hex.y,
        tile: { ...tile, groundFeature: tile.groundFeature ? null : 'FOREST' },
      });
    });
    const drag = new Drag(app.ticker, app.stage).addListener((x, y) =>
      drawer.moveBy(x, y)
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
      storeUnsubscribe();
      store.dispatch({ type: RESET });
      window.removeEventListener('resize', resize);
      click.stop();
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
      div.removeChild(app.view);
    });
  };
};

export default launch;
