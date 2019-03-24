import Axios from 'axios';
import React, {
  FunctionComponent,
  useCallback,
  useLayoutEffect,
  useState,
} from 'react';
import { Store } from 'redux';
import Notification from '../components/Notification';
import useDispatch from '../logic/useDispatch';
import useStore from '../logic/useStore';
import './App.css';
import Content from './Content';
import Game from './Game';
import UI from './UI';
import User from '../data/User';

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
    let user: User;
    try {
      user = JSON.parse(rawUser);
    } catch (error) {
      return;
    }
    dispatch({ type: 'login', user });
    Axios.get('/api/user/data', {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(res => {
        dispatch({ type: 'login', user: { ...user, ...res.data } });
        localStorage.setItem('user', JSON.stringify(user));
      })
      .catch(() => {
        // TODO notify the user?
      });
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
