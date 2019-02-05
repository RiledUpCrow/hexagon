import React, { FunctionComponent, memo, useRef, useEffect } from 'react';
import Pixi from './graphics/Pixi';

const Game: FunctionComponent = (): JSX.Element => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = container.current;
    if (!div) {
      return;
    }
    div.appendChild(Pixi.view);
  });

  return <div ref={container} />;
};

export default memo(Game);
