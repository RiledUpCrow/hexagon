import React, { FunctionComponent, memo, useRef, useEffect } from 'react';
import Pixi from './graphics/Pixi';
import Settings from './Settings';

interface Props {
  settings: Settings;
}

const Game: FunctionComponent<Props> = (): JSX.Element => {
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
