import React, { FunctionComponent, memo, useEffect, useRef } from 'react';
import './Game.css';
import pixi from '../graphics/Pixi';
import Settings from '../data/Settings';
import { TileData } from './UI';

interface Props {
  settings: Settings;
  onReady: () => void;
  onSelect: (tileData: TileData) => void;
}

const Game: FunctionComponent<Props> = ({
  settings,
  onReady,
  onSelect,
}): JSX.Element => {
  const { mapHeight, mapWidth, size, maxZoom, minZoom } = settings;
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = container.current;
    if (!div) {
      return;
    }
    const destroyPixi = pixi(settings, div, onReady, onSelect);

    return destroyPixi;
  }, [mapHeight, mapWidth, size, maxZoom, minZoom]);

  return <div className="Game-root" ref={container} />;
};

export default memo(Game);
