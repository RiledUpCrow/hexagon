import React, { FunctionComponent, memo, useCallback, useState } from 'react';
import './MainMenu.css';
import Settings, { defaultSettings } from '../data/Settings';
import Button from '../components/Button';
import NumberPicker from '../components/NumberPicker';

interface Props {
  startGame: (settings: Settings) => void;
}

const MainMenu: FunctionComponent<Props> = ({ startGame }): JSX.Element => {
  const [mapWidth, setMapWidth] = useState(defaultSettings.mapWidth);
  const [mapHeight, setMapHeight] = useState(defaultSettings.mapHeight);
  const [size, setSize] = useState(defaultSettings.size);
  const [maxZoom, setMaxZoom] = useState(defaultSettings.maxZoom);
  const [minZoom, setMinZoom] = useState(defaultSettings.minZoom);

  const handleStart = useCallback(() => {
    startGame({
      mapWidth,
      mapHeight,
      size,
      maxZoom,
      minZoom,
    });
  }, [mapWidth, mapHeight, size, maxZoom, minZoom, startGame]);

  return (
    <div className="MainMenu-root">
      <h1 className="MainMenu-title">Settings</h1>
      <div className="MainMenu-settings">
        <NumberPicker
          label="Map width"
          min={16}
          max={128}
          step={16}
          value={mapWidth}
          onChange={setMapWidth}
        />
        <NumberPicker
          label="Map height"
          min={10}
          max={80}
          step={10}
          value={mapHeight}
          onChange={setMapHeight}
        />
        <NumberPicker
          label="Tile size"
          min={10}
          max={100}
          step={10}
          value={size}
          onChange={setSize}
        />
        <NumberPicker
          label="Max zoom"
          min={1}
          max={5}
          step={0.25}
          value={maxZoom}
          onChange={setMaxZoom}
        />
        <NumberPicker
          label="Min zoom"
          min={0.25}
          max={1}
          step={0.25}
          value={minZoom}
          onChange={setMinZoom}
        />
      </div>
      <div className="MainMenu-start">
        <Button size="large" wide onClick={handleStart}>
          Start
        </Button>
      </div>
    </div>
  );
};

export default memo(MainMenu);
