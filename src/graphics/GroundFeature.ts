export const groundFeatures: { [name: string]: string | null } = {
  FLAT: null,
  HILL: "hill.png",
  MOUNTAIN: "mountain.png"
};

export type GroundFeature = keyof typeof groundFeatures;
