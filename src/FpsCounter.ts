import { Application, Text } from "pixi.js";

type Measurement = { timestamp: number; fps: number };

export default class FpsCounter {
  private readonly text: Text;
  private sample: Measurement[] = [];
  constructor(app: Application, sampleTime: number = 1000) {
    this.text = new Text("60", { stroke: 0xffffff, strokeThickness: 5 });
    app.stage.addChild(this.text);
    app.ticker.add(() => {
      const measurement = {
        timestamp: new Date().getTime(),
        fps: app.ticker.FPS
      };
      const now = new Date().getTime();
      this.sample = [
        measurement,
        ...this.sample.filter(m => now - m.timestamp < sampleTime)
      ];
      this.text.text = String(
        Math.round(
          this.sample.reduce((prev, curr) => prev + curr.fps, 0) /
            this.sample.length
        )
      );
    });
  }
}
