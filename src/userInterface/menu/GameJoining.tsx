import React, {
  FunctionComponent,
  memo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import useStore from '../../logic/useStore';
import Axios from 'axios';
import useRequest from '../../logic/useRequest';
import Game from '../../data/Game';
import Dialog from '../components/Dialog';
import Button from '../components/Button';
import Loading from './Loading';
import ErrorText from '../components/ErrorText';
import useDispatch from '../../logic/useDispatch';
import GameInfo from './game/GameInfo';
import './GameJoining.scss';

const path = window.location.pathname;
const result = path.match(/^\/invite\/([a-zA-Z0-9]+)$/);
const initialToken = result && result.length >= 2 ? result[1] : undefined;
if (initialToken) {
  window.history.replaceState({}, document.title, window.location.origin);
}

const GameJoining: FunctionComponent = () => {
  const user = useStore(s => s.user.profile);
  const [token, setToken] = useState<string | undefined>(initialToken);

  const [open, setOpen] = useState(Boolean(initialToken));
  const handleClose = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (token && user) {
      setOpen(true);
    }
  }, [user, token]);

  const [game, setGame] = useState<Game | null>(null);
  const [infoRequest, infoLoading, infoError] = useRequest(
    (token: string) => Axios.get(`/api/game/inviteInfo/${token}`),
    res => {
      const game = res.data;
      setGame(game);
    },
    []
  );

  useEffect(() => {
    if (token) {
      infoRequest(token);
    }
  }, [token, infoRequest]);

  const handleEnd = useCallback(() => {
    setOpen(false);
    setToken(undefined);
  }, []);

  const dispatch = useDispatch();
  const [joinRequest, joinLoading, joinError] = useRequest(
    () => Axios.post(`/api/game/join`, { invite: token }),
    res => {
      const game = res.data as Game;
      dispatch({ type: 'add_game', game });
      handleEnd();
    },
    [token, handleEnd]
  );

  if (!token) {
    return null;
  }

  if (!user) {
    return (
      <Dialog open={open} onClose={handleClose}>
        <p>
          You have been invited to a game! Please log in or register to
          continue.
        </p>
        <Button color="primary" onClick={handleClose}>
          Continue
        </Button>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={() => {}}>
      <Loading loading={infoLoading || joinLoading}>
        <h2>Join game</h2>
        <ErrorText error={infoError || joinError} />
        {infoLoading ? (
          <p>loading...</p>
        ) : game ? (
          <GameInfo game={game} />
        ) : null}
        <div className="GameJoining-buttons">
          <Button color="primary" onClick={joinRequest}>
            Join
          </Button>
          <Button onClick={handleEnd}>Cancel</Button>
        </div>
      </Loading>
    </Dialog>
  );
};

export default memo(GameJoining);
