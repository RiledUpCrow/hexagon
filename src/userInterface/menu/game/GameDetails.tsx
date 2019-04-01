import React, { FunctionComponent, memo, useState } from 'react';
import useStore from '../../../logic/useStore';
import Menu from '../Menu';
import './GameDetails.css';
import Icon from 'react-icons-kit';
import { pencil } from 'react-icons-kit/fa/pencil';
import TextInput from '../../components/TextInput';
import useRequest from '../../../logic/useRequest';
import Axios from 'axios';
import ErrorText from '../../components/ErrorText';
import useDispatch from '../../../logic/useDispatch';

interface Props {
  param: string;
}

const GameDetails: FunctionComponent<Props> = props => {
  const { param } = props;
  const game = useStore(s => s.user!.games.find(g => g.id === param));

  const [editing, setEditing] = useState(false);
  const [text, setText] = useState('');

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

  if (!game) {
    return <p>This game does not exist</p>;
  }

  return (
    <Menu title="Game details" loading={loading}>
      <ErrorText error={error} />
      {editing ? (
        <TextInput
          label="Name"
          autoFocus
          value={text}
          onChange={setText}
          onEnter={() => {
            rename(text);
          }}
        />
      ) : (
        <h2 className="GameDetails-name">
          {game.displayName}{' '}
          <Icon
            icon={pencil}
            onClick={() => {
              setText(game.displayName);
              setEditing(true);
            }}
          />
        </h2>
      )}
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
    </Menu>
  );
};

export default memo(GameDetails);
