export default interface Settings {
  mapWidth: number;
  mapHeight: number;
  size: number;
  maxZoom: number;
  minZoom: number;
  tilt: number;
  coverage: number;
}

export const defaultSettings: Settings = {
  mapWidth: 128,
  mapHeight: 80,
  size: 50,
  maxZoom: 1.5,
  minZoom: 0.5,
  tilt: 30,
  coverage: 1,
};
