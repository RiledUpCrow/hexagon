import * as PIXI from "pixi.js";
import Drawer from "./Drawer";
import Drag from "./Drag";
import { DefaultMap } from "./Map";

const app = new PIXI.Application(window.innerWidth, window.innerHeight, {
  antialias: true,
  autoResize: true,
  resolution: devicePixelRatio
});

app.stage.interactive = true;

const container = new PIXI.Container();
app.stage.addChild(container);

const map = new DefaultMap(40, 20);
const drawer = new Drawer(
  container,
  map,
  40,
  window.innerWidth,
  window.innerHeight
);
drawer.drawMap();

const drag = new Drag(app.stage).addListener((x, y) => {
  drawer.moveMapBy(x, y);
});

const resize = () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  drawer.resize(window.innerWidth, window.innerHeight);
};
window.addEventListener("resize", resize);
resize();

export default app;
