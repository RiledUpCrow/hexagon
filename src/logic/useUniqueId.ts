import { useMemo } from 'react';

export default () => {
  const id = useMemo(() => {
    let hash = '';
    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 8; i++)
      hash += possible.charAt(Math.floor(Math.random() * possible.length));

    return hash;
  }, []);
  return id;
};
