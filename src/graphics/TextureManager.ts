import { GroundFeature as GF } from './GroundFeature';
import { GroundType as GT } from './GroundType';
import { UnitType as UT } from './UnitType';
import {
  Loader,
  Texture,
  Sprite,
  Renderer,
  SCALE_MODES,
  Rectangle,
} from 'pixi.js';

type GroundFeatures = { [key in GF]: string };
type GroundTypes = { [key in GT]: string };
type UnitTypes = { [key in UT]: string };

export default class TextureManager {
  public static readonly groundFeatures: GroundFeatures = {
    FOREST: 'forest.png',
  };
  public static readonly groundTypes: GroundTypes = {
    GRASSLAND: 'grassland.png',
    GRASS_HILL: 'grasshill.png',
    PLAINS: 'plains.png',
    TUNDRA: 'tundra.png',
    DESERT: 'desert.png',
    SNOW: 'snow.png',
    WATER: 'water.png',
    MOUNTAIN: 'mountain.png',
  };
  public static readonly unitTypes: UnitTypes = {
    WARRIOR: 'warrior.png',
  };

  private readonly textureKeys: string[] = [];
  private readonly mipMaps: {
    [key: string]: { [size: number]: Texture };
  } = {};

  private readonly SIZES = new Array(6)
    .fill(null)
    .map((_, index) => Math.pow(2, index));

  public constructor(private loader: Loader, private renderer: Renderer) {}

  public load = (): Promise<void> => {
    return new Promise(resolve => {
      this.loadBaseTextures(this.loader);
      this.loader.load(() => {
        this.textureKeys.forEach(key => {
          if (this.mipMaps[key]) {
            return;
          }
          const mipMaps: { [size: number]: Texture } = {};
          this.SIZES.forEach(size => {
            mipMaps[size] = this.generateMipMap(
              this.loader,
              this.renderer,
              key,
              size
            );
          });
          this.mipMaps[key] = mipMaps;
        });

        resolve();
      });
    });
  };

  public getGroundFeature = (
    gf: GF,
    width: number,
    height?: number
  ): Sprite => {
    return this.getSprite(TextureManager.groundFeatures[gf], width, height);
  };

  public getGroundType = (gt: GT, width: number, height?: number): Sprite => {
    return this.getSprite(TextureManager.groundTypes[gt], width, height);
  };

  public getUnitType = (ut: UT, width: number, height?: number): Sprite => {
    return this.getSprite(TextureManager.unitTypes[ut], width, height);
  };

  public cleanup = () => {
    Object.keys(this.loader.resources).forEach(key => {
      this.loader.resources[key].texture.destroy();
      Object.keys(this.mipMaps).forEach(key => {
        const mipMap = this.mipMaps[key];
        Object.keys(mipMap).forEach(size => {
          const texture = mipMap[Number(size)];
          texture.destroy();
        });
      });
    });
  };

  private getSprite = (key: string, width: number, height?: number): Sprite => {
    const mipMaps = this.mipMaps[key];
    let bestTexture: Texture | null = null;
    for (let i = 0; i < this.SIZES.length; i++) {
      const size = this.SIZES[i];
      const texture = mipMaps[size];
      let target;
      if (height !== undefined) {
        target = height * devicePixelRatio * (width * devicePixelRatio);
      } else {
        const scale = (width * devicePixelRatio) / texture.width;
        const someHeight = texture.height * scale;
        target = width * devicePixelRatio * someHeight;
      }
      const thisSize = texture.width * texture.height;
      if (thisSize > target) {
        bestTexture = texture;
      }
    }

    const result = new Sprite(bestTexture!);
    if (height !== undefined) {
      result.height = height;
    } else {
      const scale = width / result.width;
      result.height = result.height * scale;
    }
    result.width = width;
    result.anchor.set(0.5, 0.5);

    return result;
  };

  private loadBaseTextures = (loader: Loader): void => {
    this.textureKeys.length = 0;

    Object.keys(TextureManager.groundFeatures).forEach(key => {
      const url = TextureManager.groundFeatures[key as GF];
      this.textureKeys.push(url);
    });

    Object.keys(TextureManager.groundTypes).forEach(key => {
      const url = TextureManager.groundTypes[key as GT];
      this.textureKeys.push(url);
    });

    Object.keys(TextureManager.unitTypes).forEach(key => {
      const url = TextureManager.unitTypes[key as UT];
      this.textureKeys.push(url);
    });

    this.textureKeys.forEach(key => {
      loader.add(key);
    });
  };

  private generateMipMap = (
    loader: Loader,
    renderer: Renderer,
    key: string,
    size: number
  ): Texture => {
    const base = loader.resources[key].texture;
    const sprite = new Sprite(base);
    sprite.width = (sprite.width / size) * devicePixelRatio;
    sprite.height = (sprite.height / size) * devicePixelRatio;
    const result = renderer.generateTexture(
      sprite,
      SCALE_MODES.LINEAR,
      1,
      new Rectangle(0, 0, sprite.width, sprite.height + devicePixelRatio * 2)
    );
    return result;
  };
}
