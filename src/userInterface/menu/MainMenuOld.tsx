import React, { FunctionComponent, memo, useCallback, useState } from 'react';
import Button from '../../components/Button';
import NumberPicker from '../../components/NumberPicker';
import Map from '../../data/Map';
import { defaultSettings } from '../../data/Settings';
import Unit from '../../data/Unit';
import useDispatch from '../../logic/useDispatch';
import useStore from '../../logic/useStore';
import './MainMenuOld.css';

const MainMenuOld: FunctionComponent = (): JSX.Element => {
  const [mapWidth, setMapWidth] = useState(defaultSettings.mapWidth);
  const [mapHeight, setMapHeight] = useState(defaultSettings.mapHeight);
  const [size, setSize] = useState(defaultSettings.size);
  const [maxZoom, setMaxZoom] = useState(defaultSettings.maxZoom);
  const [minZoom, setMinZoom] = useState(defaultSettings.minZoom);

  const map = useStore(s => s.map);
  const dispatch = useDispatch();

  const generateMap = useCallback(async () => {
    const map: Map = await fetch('/map')
      .then(res => res.json())
      .then(tiles => ({ width: mapWidth, height: mapHeight, tiles }));
    const units: Unit[] = [
      { id: 0, type: 'WARRIOR', position: { x: 1, y: 1 } },
      { id: 1, type: 'WARRIOR', position: { x: 1, y: 2 } },
      { id: 2, type: 'WARRIOR', position: { x: 1, y: 3 } },
    ];
    dispatch({ type: 'load_map', map, units });
  }, [mapWidth, mapHeight]);

  const handleStart = useCallback(() => {
    dispatch({
      type: 'start_game',
      gameData: {
        settings: {
          mapWidth,
          mapHeight,
          size,
          maxZoom,
          minZoom,
        },
      },
    });
  }, [mapWidth, mapHeight, size, maxZoom, minZoom]);

  return (
    <div className="MainMenuOld-root">
      <h1 className="MainMenuOld-title">Settings</h1>
      <div className="MainMenuOld-settings">
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
        <div className="MainMenuOld-generate">
          <Button onClick={generateMap}>Generate Map</Button>
        </div>
      </div>
      <div className="MainMenuOld-start">
        <Button disabled={!map} size="large" wide onClick={handleStart}>
          Start
        </Button>
      </div>
    </div>
  );
};

export default memo(MainMenuOld);
