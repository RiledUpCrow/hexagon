import React, { FunctionComponent, useCallback, useState } from 'react';
import Settings from '../data/Settings';
import './App.css';
import Game from './Game';
import MainMenu from './MainMenu';
import UI from './UI';
import { Store } from 'redux';

interface Props {
  store: Store;
}

const App: FunctionComponent<Props> = (): JSX.Element => {
  const [ready, setReady] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);

  const [game, setGame] = useState<Settings | null>(null);
  const startGame = useCallback((settings: Settings) => {
    setGame(settings);
  }, []);
  const endGame = useCallback(() => {
    setReady(false);
    setGame(null);
  }, []);

  return (
    <div className="App-root">
      {game ? (
        <>
          <Game settings={game} onReady={handleReady} />
          <UI endGame={endGame} ready={ready} />
        </>
      ) : (
        <MainMenu startGame={startGame} />
      )}
    </div>
  );
};

export default App;
