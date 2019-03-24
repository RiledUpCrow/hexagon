import React, { FunctionComponent, memo, useCallback, useState } from 'react';
import { defaultSettings } from '../../data/Settings';
import useDispatch from '../../logic/useDispatch';
import useStore from '../../logic/useStore';
import Button from '../components/Button';
import Loader from '../components/Loader';
import NumberPicker from '../components/NumberPicker';
import './CreateGame.css';
import useRequest from '../../logic/useRequest';
import ErrorText from '../components/ErrorText';
import Axios from 'axios';

interface Props {
  param: string;
}

const CreateGame: FunctionComponent<Props> = props => {
  const { param: engineId } = props;
  const engine = useStore(s => s.user!.engines.find(e => e.id === engineId));

  const [mapWidth, setMapWidth] = useState(defaultSettings.mapWidth);
  const [mapHeight, setMapHeight] = useState(defaultSettings.mapHeight);
  const [players, setPlayers] = useState(2);

  const dispatch = useDispatch();
  const back = useCallback(() => dispatch({ type: 'back' }), []);

  const [generateMap, loading, error] = useRequest(
    () =>
      Axios.post(`/api/engine/createGame/${engineId}`, {
        mapWidth,
        mapHeight,
        players,
      }),
    () => {
      // TODO add the game to the list of games
      dispatch({ type: 'navigate', view: 'mainMenu' });
    },
    [mapHeight, mapWidth, players]
  );

  if (!engine) {
    return <h1>This engine does not exist</h1>;
  }

  return (
    <div className="CreateGame-root">
      <h1 className="CreateGame-title">New game</h1>
      <div className="CreateGame-settings">
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
          label="Players"
          min={2}
          max={16}
          step={1}
          value={players}
          onChange={setPlayers}
        />
        <ErrorText error={error} />
        <Button
          disabled={loading}
          className="CreateGame-button"
          onClick={generateMap}
          color="secondary"
        >
          Generate Map
        </Button>
      </div>
      <Button className="CreateGame-button" onClick={back}>
        Back
      </Button>
      {loading && (
        <div className="CreateGame-loader">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default memo(CreateGame);
