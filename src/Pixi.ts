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

const map = new DefaultMap(300, 200);
const drawer = new Drawer(
  container,
  map,
  50,
  window.innerWidth,
  window.innerHeight
);
drawer.drawMap();

const drag = new Drag(app.ticker, app.stage).addListener((x, y) => {
  drawer.moveMapBy(x, y);
});

const text = new PIXI.Text("60");

app.stage.addChild(text);

const resize = () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  drawer.resize(window.innerWidth, window.innerHeight);
};
window.addEventListener("resize", resize);
resize();

app.ticker.add(() => {
  text.text = String(Math.round(app.ticker.FPS));
});

export default app;
