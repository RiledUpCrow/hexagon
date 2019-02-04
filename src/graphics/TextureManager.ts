import { GroundFeature as GF } from "./GroundFeature";
import { GroundType as GT } from "./GroundType";
import { UnitType as UT } from "./UnitType";
import { Loader } from "pixi.js";

type TextureUrl = string;

type GroundFeatures = { [key in GF]: TextureUrl | null };
type GroundTypes = { [key in GT]: TextureUrl };
type UnitTypes = { [key in UT]: TextureUrl };

export default class TextureManager {
  public static readonly groundFeatures: GroundFeatures = {
    FLAT: null,
    FOREST: "forest.png"
  };
  public static readonly groundTypes: GroundTypes = {
    GRASSLAND: "grassland.png",
    GRASS_HILL: "grasshill.png",
    PLAINS: "plains.png",
    TUNDRA: "tundra.png",
    DESERT: "desert.png",
    SNOW: "snow.png",
    WATER: "water.png",
    MOUNTAIN: "mountain.png"
  };
  public static readonly unitTypes: UnitTypes = {
    WARRIOR: "warrior.png"
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

      Object.keys(TextureManager.unitTypes).forEach(key => {
        const url = TextureManager.unitTypes[key as UT];
        loader.add(url);
      });

      loader.load(resolve);
    });
  };
}
