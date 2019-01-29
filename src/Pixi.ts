import * as PIXI from "pixi.js";
import Hex from "./Hex";
import Point from "./Point";
import Drawer from "./Drawer";

const app = new PIXI.Application(window.innerWidth, window.innerHeight, {
  antialias: true,
  autoResize: true,
  resolution: devicePixelRatio
});

app.stage.interactive = true;

const graphics = new PIXI.Graphics();

const hex = new Hex(
  new Point(window.innerWidth / 2, window.innerHeight / 2),
  60
);

const drawer = new Drawer(graphics);

drawer.drawHex(hex);
drawer.drawHex(hex.getAdjacentHex(1));
drawer.drawHex(hex.getAdjacentHex(2));
drawer.drawHex(hex.getAdjacentHex(3));
drawer.drawHex(hex.getAdjacentHex(4));
drawer.drawHex(hex.getAdjacentHex(5));
drawer.drawHex(hex.getAdjacentHex(6));

app.stage.addChild(graphics);

// Listen for window resize events
window.addEventListener("resize", resize);

// Resize function window
function resize() {
  // Resize the renderer
  app.renderer.resize(window.innerWidth, window.innerHeight);
}

resize();

export default app;
