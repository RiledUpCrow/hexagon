import { Application, Container } from 'pixi.js';
import { Store } from 'redux';
import Settings from '../data/Settings';
import { MOVE_UNIT, RESET, SELECT_TILE, SELECT_UNIT } from '../store/actions';
import MoveUnitAction from '../store/actions/moveUnitAction';
import SelectUnitAction from '../store/actions/selectUnitAction';
import { RootState } from '../store/reducers';
import BackgroundLayer from './BackgroundLayer';
import Click from './Click';
import DimensionsProvider from './DimensionsProvider';
import Drag from './Drag';
import FpsCounter from './FpsCounter';
import MapDrawer from './MapDrawer';
import TextureManager from './TextureManager';
import TileLayer from './TileLayer';
import UnitLayer from './UnitLayer';
import Zoom from './Zoom';

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

    const backgroundContainer = new Container();
    const tileContainer = new Container();
    const unitContainer = new Container();
    container.addChild(backgroundContainer, tileContainer, unitContainer);

    const layers = [
      new BackgroundLayer(backgroundContainer, dp),
      new TileLayer(
        tileContainer,
        textureManager,
        () => store.getState().map!,
        dp
      ),
      new UnitLayer(
        unitContainer,
        textureManager,
        () => store.getState().units,
        () => store.getState().movement,
        dp
      ),
    ];

    const drawer = new MapDrawer(
      layers,
      container,
      () => store.getState().map!,
      dp,
      size,
      div.clientWidth,
      div.clientHeight,
      minZoom,
      maxZoom
    );

    const storeUnsubscribe = store.subscribe(() => {
      layers.forEach(layer => layer.update());
    });

    const onTick = (): void => {
      layers.forEach(layer => layer.animate());
    };

    app.ticker.add(onTick);

    const click = new Click(app.stage).addListener((x, y) => {
      const local = dp.toLocalPoint({ x, y });
      const hex = dp.toHex(local);
      if (hex.x < 0 || hex.x >= mapWidth || hex.y < 0 || hex.y >= mapHeight) {
        return;
      }
      const tile = store.getState().map!.tiles[hex.x][hex.y];
      if (!tile) {
        return;
      }
      store.dispatch({ type: SELECT_TILE, tile, position: hex });
      const selectedUnit = store.getState().selectedUnit;
      const currentUnits = store.getState().units;
      const currentUnitsArray = Object.keys(currentUnits).map(
        key => currentUnits[Number(key)]
      );
      const unit = currentUnitsArray.find(
        unit => unit.position.x === hex.x && unit.position.y === hex.y
      );
      if (unit) {
        store.dispatch<SelectUnitAction>({ type: SELECT_UNIT, unit });
      } else {
        if (selectedUnit) {
          store.dispatch<MoveUnitAction>({
            type: MOVE_UNIT,
            unit: selectedUnit,
            movement: [{ x: hex.x, y: hex.y }],
          });
        }
      }
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
      app.ticker.remove(onTick);
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
