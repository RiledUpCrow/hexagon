import Axios from 'axios';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Store } from 'redux';
import Notification from './components/Notification';
import User from '../data/User';
import useDispatch from '../logic/useDispatch';
import useRequest from '../logic/useRequest';
import useStore from '../logic/useStore';
import './App.css';
import Content from './Content';
import Game from './Game';
import UI from './UI';

interface Props {
  store: Store;
}

const App: FunctionComponent<Props> = (): JSX.Element => {
  const dispatch = useDispatch();

  const [ready, setReady] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);
  const endGame = useCallback(() => {
    setReady(false);
    dispatch({ type: 'reset' });
  }, []);
  const game = useStore(s => s.game);
  const update = useStore(s => s.update);
  const [userRequest] = useRequest(
    (user: User) =>
      Axios.get('/api/user/data', {
        headers: { Authorization: `Bearer ${user.token}` },
      }),
    (res, user) => {
      const updatedUser = { ...res.data, token: user.token };
      dispatch({ type: 'login', user: updatedUser });
      localStorage.setItem('user', JSON.stringify(updatedUser));
    },
    []
  );

  useLayoutEffect(() => {
    try {
      const rawUser = localStorage.getItem('user');
      if (!rawUser) {
        return;
      }
      const user = JSON.parse(rawUser);
      dispatch({ type: 'login', user });
      userRequest(user);
    } catch (error) {
      return;
    }
  }, []);

  const user = useStore(s => s.user);
  const authInterceptorId = useRef<number | null>(null);
  useEffect(() => {
    if (authInterceptorId.current !== null) {
      Axios.interceptors.request.eject(authInterceptorId.current);
    }
    if (user) {
      const id = Axios.interceptors.request.use(config => {
        config.headers = { Authorization: `Bearer ${user.token}` };
        return config;
      });
      authInterceptorId.current = id;
    }
  }, [user]);

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
