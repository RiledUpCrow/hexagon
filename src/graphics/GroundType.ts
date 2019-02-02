type Color = number;

export const groundTypes: { [name: string]: Color } = {
  GRASSLAND: 0x228b22,
  PLAINS: 0x00ff7f,
  DESERT: 0xfffacd,
  TUNDRA: 0xa9a9a9,
  SNOW: 0xf5fffa
};

export type GroundType = keyof typeof groundTypes;
