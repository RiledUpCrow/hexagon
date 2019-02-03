import { GroundFeature as GF } from "./GroundFeature";
import { GroundType as GT } from "./GroundType";
import { Loader } from "pixi.js";

type TextureUrl = string;

type GroundFeatures = { [key in GF]: TextureUrl | null };
type GroundTypes = { [key in GT]: TextureUrl };

export default class TextureManager {
  public static readonly groundFeatures: GroundFeatures = {
    FLAT: null,
    HILL: "hill.png",
    MOUNTAIN: "mountain.png"
  };
  public static readonly groundTypes: GroundTypes = {
    GRASSLAND: "grassland.png",
    PLAINS: "plains.png",
    TUNDRA: "tundra.png",
    DESERT: "desert.png",
    SNOW: "snow.png"
  };

  public static load = (loader: Loader): Promise<void> => {
    return new Promise(resolve => {
      Object.keys(TextureManager.groundFeatures).forEach(key => {
        const url = TextureManager.groundFeatures[key as GF];
        if (url) {
          loader.add(url);
        }
      });

      Object.keys(TextureManager.groundTypes).forEach(key => {
        const urlOrColor = TextureManager.groundTypes[key as GT];
        if (typeof urlOrColor === "string") {
          loader.add(urlOrColor);
        }
      });

      loader.load(resolve);
    });
  };
}
