import React, { FunctionComponent, memo, useRef, useEffect } from 'react';
import Pixi from './Pixi';

const Game: FunctionComponent = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = container.current;
    if (!div) {
      return;
    }
    div.appendChild(Pixi.view);
  });

  return <div ref={container} />;
}

export default memo(Game);