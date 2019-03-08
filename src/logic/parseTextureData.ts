import { TextureData, RawTextureData } from '../data/TextureData';

const SVG_POINTS = 512;

/**
 * Parses the data in Inkscape format into Pixi format. The texture atlases
 * are created in Inkscape on a 512x512 page, where Y coordinate goes bottom-up,
 * and X goes left-right. In Pixi the texture has 2048x2048 pixels and Y goes
 * top-down. Also anchor in Inkscape is just a coordinate, while in Pixi it's
 * a fraction of the dimensions.
 */
export default (atlas: string, textureSize: number = 2048) => (
  data: RawTextureData[]
) => (size: number): TextureData[] =>
  data.map(d => {
    const { x, y, width, height, anchorX, anchorY, frames } = d;
    const scale = textureSize / SVG_POINTS;
    return {
      atlas,
      x: (x * scale) / size,
      y: ((SVG_POINTS - (y + height)) * scale) / size,
      width: (width * scale) / size,
      height: (height * scale) / size,
      anchorX: anchorX === undefined ? 0.5 : 0.5 + anchorX / width,
      anchorY: anchorY === undefined ? 0.5 : 0.5 - anchorY / height,
      frames: frames ? frames : 10,
    };
  });
