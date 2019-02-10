import React, { FunctionComponent, memo, useEffect, useRef } from 'react';
import './Game.css';
import Pixi from '../graphics/Pixi';
import Settings from '../data/Settings';

interface Props {
  settings: Settings;
}

const Game: FunctionComponent<Props> = ({ settings }): JSX.Element => {
  const { mapHeight, mapWidth, size, maxZoom, minZoom } = settings;
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = container.current;
    if (!div) {
      return;
    }
    const destroyPixi = Pixi(settings, div);

    return destroyPixi;
  }, [mapHeight, mapWidth, size, maxZoom, minZoom]);

  return <div className="Game-root" ref={container} />;
};

export default memo(Game);
