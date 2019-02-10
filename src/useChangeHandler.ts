import { ChangeEvent, useState, useCallback } from 'react';

type Handler = (event: ChangeEvent<HTMLInputElement>) => void;

/**
 * Like useState but for input onChange attribute.
 */
export default (defaultValue: string): [string, Handler] => {
  const [value, setValue] = useState(defaultValue);
  const handler = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  }, []);
  return [value, handler];
};
