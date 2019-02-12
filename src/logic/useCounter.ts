import { useState, useCallback } from 'react';

export default (start = 0): [number, () => void] => {
  const [count, setCount] = useState(start);
  const increment = useCallback(() => setCount(count => count + 1), []);
  return [count, increment];
};
