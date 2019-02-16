import React, {
  FunctionComponent,
  memo,
  useEffect,
  useRef,
  useContext,
} from 'react';
import './Game.css';
import pixi from '../graphics/Pixi';
import Settings from '../data/Settings';
import { StoreContext } from '../store/store';

interface Props {
  settings: Settings;
  onReady: () => void;
}

const Game: FunctionComponent<Props> = ({ settings, onReady }): JSX.Element => {
  const { mapHeight, mapWidth, size, maxZoom, minZoom } = settings;
  const container = useRef<HTMLDivElement>(null);
  const store = useContext(StoreContext);

  useEffect(() => {
    const div = container.current;
    if (!div) {
      return;
    }
    const destroyPixi = pixi(settings, div, onReady, store);

    return destroyPixi;
  }, [mapHeight, mapWidth, size, maxZoom, minZoom]);

  return <div className="Game-root" ref={container} />;
};

export default memo(Game);
