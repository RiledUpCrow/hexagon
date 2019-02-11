import React, { FunctionComponent, useCallback, useState } from 'react';
import Settings from '../data/Settings';
import './App.css';
import Game from './Game';
import MainMenu from './MainMenu';
import UI, { TileData } from './UI';

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

  const [selectedTile, setSelectedTile] = useState<TileData>(null);

  return (
    <div className="App-root">
      {game ? (
        <>
          <Game
            settings={game}
            onReady={handleReady}
            onSelect={setSelectedTile}
          />
          <UI endGame={endGame} ready={ready} tile={selectedTile} />
        </>
      ) : (
        <MainMenu startGame={startGame} />
      )}
    </div>
  );
};

export default App;
