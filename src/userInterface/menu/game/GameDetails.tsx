import Axios from 'axios';
import React, { FunctionComponent, memo, useCallback, useState } from 'react';
import Icon from 'react-icons-kit';
import { pencil } from 'react-icons-kit/fa/pencil';
import useDispatch from '../../../logic/useDispatch';
import useRequest from '../../../logic/useRequest';
import useStore from '../../../logic/useStore';
import Button from '../../components/Button';
import Dialog from '../../components/Dialog';
import ErrorText from '../../components/ErrorText';
import TextInput from '../../components/TextInput';
import Loading from '../Loading';
import Menu from '../Menu';
import './GameDetails.css';

interface Props {
  param: string;
}

const GameDetails: FunctionComponent<Props> = props => {
  const { param } = props;
  const game = useStore(s => s.user!.games.find(g => g.id === param));

  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(game ? game.displayName : '');

  const dispatch = useDispatch();
  const [rename, loading, error] = useRequest(
    (name: string) => Axios.post(`/api/game/rename/${game!.id}`, { name }),
    (res, name) => {
      setText(name);
      setEditing(false);
      dispatch({ type: 'rename_game', game: game!, name });
    },
    [game, text]
  );

  const handleRename = useCallback(() => {
    rename(text);
  }, [text]);

  const handleOpen = useCallback(() => {
    setEditing(true);
  }, []);

  const handleClose = useCallback(() => {
    setEditing(false);
  }, []);

  if (!game) {
    return <p>This game does not exist</p>;
  }

  return (
    <Menu title="Game details">
      <div className="GameDetails-line">
        <div>Name</div>
        <div>{game.displayName}</div>
      </div>
      <div className="GameDetails-line">
        <div>Status</div>
        <div>{game.online ? 'Ready' : 'Engine offline'}</div>
      </div>
      <div className="GameDetails-line">
        <div>Players</div>
        <div className="GameDetails-list">
          {game.players.map(player => (
            <div>{player}</div>
          ))}
        </div>
      </div>
      <ErrorText error={error} />
      <Button wide onClick={handleOpen}>
        Rename <Icon icon={pencil} />
      </Button>
      <Dialog open={editing} onClose={handleClose}>
        <Loading loading={loading}>
          <TextInput
            autoFocus
            label="Rename game"
            onEnter={handleRename}
            onChange={setText}
            value={text}
          />
          <div className="GameDetails-renameButtons">
            <Button
              color="secondary"
              className="GameDetails-renameButton"
              onClick={handleRename}
            >
              Rename
            </Button>
            <Button className="GameDetails-renameButton" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </Loading>
      </Dialog>
    </Menu>
  );
};

export default memo(GameDetails);
