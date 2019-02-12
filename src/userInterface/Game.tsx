import React, { FunctionComponent, memo, useEffect, useRef } from 'react';
import './Game.css';
import pixi from '../graphics/Pixi';
import Settings from '../data/Settings';
import { Dispatch } from 'redux';

interface Props {
  settings: Settings;
  onReady: () => void;
  dispatch: Dispatch;
}

const Game: FunctionComponent<Props> = ({
  settings,
  onReady,
  dispatch,
}): JSX.Element => {
  const { mapHeight, mapWidth, size, maxZoom, minZoom } = settings;
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = container.current;
    if (!div) {
      return;
    }
    const destroyPixi = pixi(settings, div, onReady, dispatch);

    return destroyPixi;
  }, [mapHeight, mapWidth, size, maxZoom, minZoom]);

  return <div className="Game-root" ref={container} />;
};

export default memo(Game);
