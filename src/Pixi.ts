import * as PIXI from "pixi.js";
import Drawer from "./Drawer";
import Drag from "./Drag";
import { DefaultMap } from "./Map";
import Zoom from "./Zoom";
import FpsCounter from "./FpsCounter";

const app = new PIXI.Application(window.innerWidth, window.innerHeight, {
  antialias: true,
  autoResize: true,
  resolution: devicePixelRatio
});

const container = new PIXI.Container();
app.stage.addChild(container);
app.stage.interactive = true;

const map = new DefaultMap(128, 80);
const drawer = new Drawer(container, map);

new Drag(app.ticker, app.stage).addListener((x, y) => drawer.moveMapBy(x, y));
new Zoom(app.stage).addListener((zoom, point) => drawer.zoom(zoom, point));
new FpsCounter(app);

const resize = () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  drawer.resize(window.innerWidth, window.innerHeight);
};
window.addEventListener("resize", resize);
resize();

export default app;
