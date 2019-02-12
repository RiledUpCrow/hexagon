import { useRef, useEffect } from 'react';

export default <T>(value: T): T | null => {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
