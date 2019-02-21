export default interface MapLayer {
  draw: () => void;
  resize: () => void;
  update: () => void;
  animate: () => void;
}
