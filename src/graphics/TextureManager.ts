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
import rawData1 from '../textures/atlas1.json';
import { GroundFeature as GF } from '../data/GroundFeature';
import { GroundType as GT } from '../data/GroundType';
import { UnitType as UT } from '../data/UnitType';
import parseTextureData from '../logic/parseTextureData';
import { TextureData } from '../data/TextureData';

type Custom = 'SELECTED' | 'HIGHLIGHT';

type TextureName = GT | GF | UT | Custom;

type AtlasParts = { [key in TextureName]: AtlasPart };

interface TextureAtlas {
  [size: number]: { [key: string]: Texture[] };
}

type AtlasPart = (size: number) => TextureData[];

const atlases = [atlas1];
const a1 = parseTextureData(atlas1, 2048);

export default class TextureManager {
  private loaded = false;

  protected readonly atlasParts: AtlasParts = {
    FOREST: a1(rawData1.FOREST),
    GRASSLAND: a1(rawData1.GRASSLAND),
    GRASS_HILL: a1(rawData1.GRASS_HILL),
    PLAINS: a1(rawData1.PLAINS),
    TUNDRA: a1(rawData1.TUNDRA),
    DESERT: a1(rawData1.DESERT),
    SNOW: a1(rawData1.SNOW),
    WATER: a1(rawData1.WATER),
    MOUNTAIN: a1(rawData1.MOUNTAIN),
    WARRIOR: a1(rawData1.WARRIOR),
    SELECTED: a1(rawData1.SELECTED),
    HIGHLIGHT: a1(rawData1.HIGHLIGHT),
  };

  private readonly textureKeys: string[] = [];
  private readonly mipMaps: {
    [key: string]: { [size: number]: Texture };
  } = {};

  private readonly SIZES = [1, 2, 4, 8];

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
              const textures = atlasPart(size)
                .filter(({ atlas: a }) => a === key)
                .map(
                  ({ x, y, width: w, height: h }) =>
                    new Texture(
                      (base as unknown) as BaseTexture,
                      new Rectangle(x, y, w, h)
                    )
                );
              this.textures[size][name] = textures;
            });
          });
          this.mipMaps[key] = mipMaps;
        });

        resolve();
      });
    });
  };

  public getGroundFeature = (gf: GF, width: number): [Sprite, () => void] => {
    return this.getSprite(gf, width);
  };

  public getGroundType = (gt: GT, width: number): [Sprite, () => void] => {
    return this.getSprite(gt, width);
  };

  public getUnitType = (ut: UT, width: number): [Sprite, () => void] => {
    return this.getSprite(ut, width);
  };

  public getCustom = (custom: Custom, width: number): [Sprite, () => void] => {
    return this.getSprite(custom, width);
  };

  private getSprite = (key: string, width: number): [Sprite, () => void] => {
    let bestTextures: Texture[] = this.textures[this.SIZES[0]][key];
    for (let i = 1; i < this.SIZES.length; i++) {
      const size = this.SIZES[i];
      const texture = this.textures[size][key][0];
      let target;
      const scale = (width * devicePixelRatio) / texture.width;
      const someHeight = texture.height * scale;
      target = width * devicePixelRatio * someHeight;
      const thisSize = texture.width * texture.height;
      if (thisSize > target) {
        bestTextures = this.textures[size][key];
      }
    }

    let index = 0;
    const result = new Sprite(bestTextures[0]!);

    const scale = width / result.width;
    result.height = result.height * scale;
    result.width = width;
    const textureData = this.atlasParts[key as TextureName](this.SIZES[0]);
    const { anchorX, anchorY } = textureData[0];
    result.anchor.set(anchorX, anchorY);

    const update = (): void => {
      if (bestTextures.length <= 1) {
        return;
      }
      index++;
      const total = textureData.reduce((acc, next) => acc + next.frames, 0);
      let frame = index % total;
      for (let i = 0; i < textureData.length; i++) {
        frame -= textureData[i].frames;
        if (frame < 0) {
          result.texture = bestTextures[i];
          break;
        }
      }
    };

    return [result, update];
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
