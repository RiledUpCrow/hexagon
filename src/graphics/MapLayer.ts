export default interface MapLayer {
  draw: (refresh: boolean) => void;
  update: () => void;
  animate: () => void;
}
