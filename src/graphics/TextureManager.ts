import {
  BaseTexture,
  Loader,
  Rectangle,
  Renderer,
  SCALE_MODES,
  Sprite,
  Texture,
} from 'pixi.js';
import { TextureData, RawTextureData } from '../data/TextureData';
import parseTextureData from '../logic/parseTextureData';
import rawData1 from '../textures/atlas1.json';
import atlas1 from '../textures/atlas1.png';

export type TextureName = keyof typeof rawData1;
type AtlasPart = (size: number) => TextureData[];
type AtlasParts = { [key in TextureName]: AtlasPart };

interface MipMap {
  [size: number]: Texture;
}

interface TextureAtlas {
  [size: number]: { [key: string]: Texture[] };
}

interface RawData {
  [key: string]: RawTextureData[];
}

const atlases: [string, RawData][] = [[atlas1, rawData1]];

export default class TextureManager {
  protected readonly atlasParts: AtlasParts;
  protected readonly textureUrls: string[] = [];
  protected readonly mipMaps: { [key: string]: MipMap } = {};
  protected readonly SIZES = [1, 1.5, 2, 3, 4, 6, 8];
  protected readonly textures: TextureAtlas = {};
  protected loaded = false;

  public constructor(protected loader: Loader, protected renderer: Renderer) {
    this.SIZES.forEach(size => {
      this.textures[size] = {};
    });
    const atlasParts: { [key: string]: AtlasPart } = {};
    atlases.forEach(data => {
      const [atlas, rawData] = data;
      Object.keys(rawData).forEach(key => {
        atlasParts[key] = parseTextureData(atlas, 2048)(rawData[key]);
      });
    });
    this.atlasParts = atlasParts as AtlasParts;
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
        this.textureUrls.forEach(this.loadTexture);
        resolve();
      });
    });
  };

  public getSprite = (
    key: TextureName,
    width: number
  ): [Sprite, () => void] => {
    let bestTextures: Texture[] = this.textures[this.SIZES[0]][key];
    for (let i = 1; i < this.SIZES.length; i++) {
      const size = this.SIZES[i];
      const texture = this.textures[size][key][0];
      if (texture.width > width * devicePixelRatio) {
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

  protected loadBaseTextures = (loader: Loader): void => {
    this.textureUrls.length = 0;
    atlases.forEach(([url]) => {
      this.textureUrls.push(url);
    });
    this.textureUrls.forEach(key => {
      loader.add(key);
    });
  };

  protected loadTexture = (key: string): void => {
    if (this.mipMaps[key]) {
      return;
    }
    const mipMaps: MipMap = {};
    this.SIZES.forEach(size => {
      const base = this.generateMipMap(this.loader, this.renderer, key, size);
      mipMaps[size] = base;
      Object.keys(this.atlasParts).forEach(name => {
        const atlasPart = this.atlasParts[name as TextureName];
        const textures = atlasPart(size)
          .filter(({ atlas: a }) => a === key)
          .map(({ x, y, width, height }) => {
            const baseTexture = (base as unknown) as BaseTexture;
            const constraints = new Rectangle(x, y, width, height);
            return new Texture(baseTexture, constraints);
          });
        this.textures[size][name] = textures;
      });
    });
    this.mipMaps[key] = mipMaps;
  };

  protected generateMipMap = (
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
