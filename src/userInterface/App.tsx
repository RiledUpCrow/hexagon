import React, {
  FunctionComponent,
  useCallback,
  useLayoutEffect,
  useState,
} from 'react';
import { Store } from 'redux';
import useDispatch from '../logic/useDispatch';
import useStore from '../logic/useStore';
import './App.css';
import Content from './Content';
import Game from './Game';
import UI from './UI';
import Notification from '../components/Notification';

interface Props {
  store: Store;
}

const App: FunctionComponent<Props> = (): JSX.Element => {
  const [ready, setReady] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);
  const endGame = useCallback(() => setReady(false), []);
  const game = useStore(s => s.game);
  const update = useStore(s => s.update);

  const dispatch = useDispatch();
  useLayoutEffect(() => {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) {
      return;
    }
    const user = JSON.parse(rawUser);
    dispatch({ type: 'login', user });
  }, []);

  return (
    <div className="App-root">
      {game ? (
        <>
          <Game settings={game.settings} onReady={handleReady} />
          <UI endGame={endGame} ready={ready} />
        </>
      ) : (
        <Content />
      )}
      {update && (
        <Notification text="New version available, close the game to update!" />
      )}
    </div>
  );
};

export default App;
