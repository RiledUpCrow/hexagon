import {
  Loader,
  Rectangle,
  Renderer,
  Sprite,
  Texture,
  SCALE_MODES,
  BaseTexture,
} from 'pixi.js';
import atlas1 from '../textures/atlas1.png';
import { GroundFeature as GF } from '../data/GroundFeature';
import { GroundType as GT } from '../data/GroundType';
import { UnitType as UT } from '../data/UnitType';

type TextureName = GT | GF | UT;

type AtlasParts = { [key in TextureName]: AtlasPart };

interface TextureAtlas {
  [size: number]: { [key: string]: Texture };
}

type AtlasPart = (
  size: number
) => {
  a: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

const atlases = [atlas1];

const coords = (x: number, y: number): AtlasPart => size => ({
  a: atlas1,
  x: (x * 64 * 4) / size,
  y: (y * 92 * 4) / size,
  w: (62 * 4) / size,
  h: (90 * 4) / size,
});

export default class TextureManager {
  private loaded = false;

  protected readonly atlasParts: AtlasParts = {
    FOREST: coords(0, 1),
    GRASSLAND: coords(0, 0),
    GRASS_HILL: coords(6, 0),
    PLAINS: coords(2, 0),
    TUNDRA: coords(1, 0),
    DESERT: coords(3, 0),
    SNOW: coords(4, 0),
    WATER: coords(5, 0),
    MOUNTAIN: coords(7, 0),
    WARRIOR: coords(1, 1),
  };

  private readonly textureKeys: string[] = [];
  private readonly mipMaps: {
    [key: string]: { [size: number]: Texture };
  } = {};

  private readonly SIZES = [1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 6, 8];

  private readonly textures: TextureAtlas = {};

  public constructor(private loader: Loader, private renderer: Renderer) {
    this.SIZES.forEach(size => {
      this.textures[size] = {};
    });
  }

  public load = (): Promise<void> => {
    return new Promise(resolve => {
      if (this.loaded) {
        resolve();
        return;
      }
      this.loaded = true;
      this.loadBaseTextures(this.loader);
      this.loader.load(() => {
        this.textureKeys.forEach(key => {
          if (this.mipMaps[key]) {
            return;
          }
          const mipMaps: { [size: number]: Texture } = {};
          this.SIZES.forEach(size => {
            const base = this.generateMipMap(
              this.loader,
              this.renderer,
              key,
              size
            );
            mipMaps[size] = base;
            Object.keys(this.atlasParts).forEach(name => {
              const atlasPart = this.atlasParts[name as TextureName];
              const { a, x, y, w, h } = atlasPart(size);
              if (key !== a) {
                return;
              }
              const texture = new Texture(
                (base as unknown) as BaseTexture,
                new Rectangle(x, y, w, h)
              );
              this.textures[size][name] = texture;
            });
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
    return this.getSprite(gf, width, height);
  };

  public getGroundType = (gt: GT, width: number, height?: number): Sprite => {
    return this.getSprite(gt, width, height);
  };

  public getUnitType = (ut: UT, width: number, height?: number): Sprite => {
    return this.getSprite(ut, width, height);
  };

  private getSprite = (key: string, width: number, height?: number): Sprite => {
    let bestTexture: Texture = this.textures[this.SIZES[0]][key];
    for (let i = 1; i < this.SIZES.length; i++) {
      const size = this.SIZES[i];
      const texture = this.textures[size][key];
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

    atlases.forEach(url => {
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
    sprite.width = sprite.width / size;
    sprite.height = sprite.height / size;
    const result = renderer.generateTexture(
      sprite,
      SCALE_MODES.LINEAR,
      1,
      new Rectangle(0, 0, 2048 / size, 2048 / size)
    );
    return result;
  };
}
