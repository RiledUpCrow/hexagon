export interface TextureData extends RawTextureData {
  atlas: string;
  anchorX: number;
  anchorY: number;
  frames: number;
}

export interface RawTextureData {
  x: number;
  y: number;
  width: number;
  height: number;
  anchorX?: number;
  anchorY?: number;
  frames?: number;
}
