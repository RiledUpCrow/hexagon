import { Application, Container } from 'pixi.js';
import { Store } from 'redux';
import Map from '../data/Map';
import Settings from '../data/Settings';
import { RESET, SELECT_TILE, SELECT_UNIT, UPDATE_UNIT } from '../store/actions';
import { RootState } from '../store/reducers';
import BackgroundLayer from './BackgroundLayer';
import Click from './Click';
import DimensionsProvider from './DimensionsProvider';
import Drag from './Drag';
import FpsCounter from './FpsCounter';
import MapDrawer from './MapDrawer';
import TextureManager from './TextureManager';
import TileLayer from './TileLayer';
import Zoom from './Zoom';
import UnitLayer from './UnitLayer';
import { UnitState } from '../store/reducers/unitReducer';
import SelectUnitAction from '../store/actions/selectUnitAction';
import UpdateUnitAction from '../store/actions/updateUnitAction';
import Unit from '../data/Unit';

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

    const map = (): Map => store.getState().map!;
    const units = (): UnitState => store.getState().units;

    const backgroundContainer = new Container();
    const tileContainer = new Container();
    const unitContainer = new Container();
    container.addChild(backgroundContainer, tileContainer, unitContainer);

    const layers = [
      new BackgroundLayer(backgroundContainer, dp),
      new TileLayer(tileContainer, textureManager, map, dp),
      new UnitLayer(unitContainer, textureManager, units, dp),
    ];

    const drawer = new MapDrawer(
      layers,
      container,
      map,
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
      const tile = map().tiles[hex.x][hex.y];
      if (!tile) {
        return;
      }
      store.dispatch({ type: SELECT_TILE, tile, position: hex });
      const selectedUnit = store.getState().selectedUnit;
      const currentUnits = units();
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
          const unit: Unit = {
            ...selectedUnit,
            position: { x: hex.x, y: hex.y },
          };
          store.dispatch<UpdateUnitAction>({ type: UPDATE_UNIT, unit });
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
