import React, { FunctionComponent, memo, useCallback, useState } from 'react';
import './MainMenu.css';
import Settings, { defaultSettings } from '../data/Settings';
import Button from '../components/Button';
import Input from '../components/Input';

interface Props {
  startGame: (settings: Settings) => void;
}

const MainMenu: FunctionComponent<Props> = ({ startGame }): JSX.Element => {
  const [mapWidth, setMapWidth] = useState(defaultSettings.mapWidth);
  const [mapHeight, setMapHeight] = useState(defaultSettings.mapHeight);
  const [size, setSize] = useState(defaultSettings.size);
  const [maxZoom, setMaxZoom] = useState(defaultSettings.maxZoom);
  const [minZoom, setMinZoom] = useState(defaultSettings.minZoom);
  const [coverage, setCoverage] = useState(defaultSettings.coverage);
  const [tilt, setTilt] = useState(defaultSettings.tilt);

  const handleStart = useCallback(() => {
    startGame({
      mapWidth,
      mapHeight,
      size,
      maxZoom,
      minZoom,
      coverage,
      tilt,
    });
  }, [mapWidth, mapHeight, size, maxZoom, minZoom, coverage, tilt, startGame]);

  return (
    <div className="root">
      <h1 className="title">Settings</h1>
      <div className="settings">
        <Input label="Map width" value={mapWidth} onChange={setMapWidth} />
        <Input label="Map height" value={mapHeight} onChange={setMapHeight} />
        <Input label="Tile size" value={size} onChange={setSize} />
        <Input label="Max zoom" value={maxZoom} onChange={setMaxZoom} />
        <Input label="Min zoom" value={minZoom} onChange={setMinZoom} />
        <Input label="Tile coverage" value={coverage} onChange={setCoverage} />
        <Input label="Camera tilt" value={tilt} onChange={setTilt} />
      </div>
      <div className="start">
        <Button size="large" wide onClick={handleStart}>
          Start
        </Button>
      </div>
    </div>
  );
};

export default memo(MainMenu);
