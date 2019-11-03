import Axios from 'axios';
import React, {
  FunctionComponent,
  memo,
  useCallback,
  useRef,
  useState,
} from 'react';
import Game from '../../../data/Game';
import useRequest from '../../../logic/useRequest';
import Button from '../../components/Button';
import Dialog from '../../components/Dialog';
import ErrorText from '../../components/ErrorText';
import TextInput from '../../components/TextInput';
import Loading from '../Loading';
import './GameInvite.css';

interface Props {
  game: Game;
  className?: string;
}

const GameInvite: FunctionComponent<Props> = props => {
  const { game, className } = props;

  const [token, setToken] = useState<string | undefined>(undefined);
  const [request, loading, error] = useRequest(
    (gameId: string) => Axios.get(`/api/game/invite/${gameId}`),
    res => setToken(res.data.invite),
    []
  );

  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => {
    setOpen(true);
    if (!token) {
      request(game.id);
    }
  }, [token, request, game]);
  const handleClose = useCallback(() => setOpen(false), []);

  const inputRef = useRef<HTMLInputElement>(null);
  const handleCopy = useCallback(() => {
    const input = inputRef.current;
    if (!input) {
      return;
    }
    input.select();
    document.execCommand('copy');
    input.blur();
    handleClose();
  }, [handleClose]);

  return (
    <>
      <Button wide onClick={handleOpen} className={className}>
        Invite players
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <Loading loading={loading}>
          <TextInput
            value={token ? `${window.location.origin}/invite/${token}` : ''}
            label="Invite link"
            inputRef={inputRef}
          />
          <ErrorText error={error} />
          <div className="GameInvite-buttons">
            <Button
              disabled={!token}
              color="secondary"
              onClick={handleCopy}
              className="GameInvite-button"
            >
              Copy
            </Button>
            <Button onClick={handleClose} className="GameInvite-button">
              Close
            </Button>
          </div>
        </Loading>
      </Dialog>
    </>
  );
};

export default memo(GameInvite);
