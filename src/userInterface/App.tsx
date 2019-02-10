import React, { FunctionComponent, useState, useCallback } from 'react';
import './App.css';
import Game from './Game';
import UI from './UI';
import MainMenu from './MainMenu';
import Settings from '../data/Settings';

const App: FunctionComponent = (): JSX.Element => {
  const [ready, setReady] = useState(false);
  const handleReady = useCallback(
    () => setTimeout(() => setReady(true), 500),
    []
  );

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
