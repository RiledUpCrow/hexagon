export default <O, K extends keyof O>(obj: O): K => {
  const keys = Object.keys(obj);
  const index = Math.floor(Math.random() * keys.length);
  return keys[index] as K;
};
