/**
 * Returns the value if it's between min and max boudaries or a boundary value
 * if it exceeds them.
 */
export default (value: number, min: number, max: number): number => {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
};
