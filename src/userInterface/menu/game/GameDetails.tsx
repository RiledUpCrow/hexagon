import Axios from 'axios';
import React, { FunctionComponent, memo } from 'react';
import Icon from 'react-icons-kit';
import { pencil } from 'react-icons-kit/fa/pencil';
import useDispatch from '../../../logic/useDispatch';
import useRequest from '../../../logic/useRequest';
import useStore from '../../../logic/useStore';
import ErrorText from '../../components/ErrorText';
import InputDialog from '../../components/InputDialog';
import Loading from '../Loading';
import Menu from '../Menu';
import './GameDetails.css';
import GameInvite from './GameInvite';

interface Props {
  param: string;
}

const GameDetails: FunctionComponent<Props> = props => {
  const { param } = props;
  const game = useStore(s => s.user.games.find(g => g.id === param));

  const dispatch = useDispatch();
  const [renameRequest, renameLoading, renameError] = useRequest(
    (name: string) => Axios.post(`/api/game/rename/${game!.id}`, { name }),
    (res, name) => {
      dispatch({ type: 'rename_game', game: game!, name });
    },
    [game]
  );

  if (!game) {
    return <p>This game does not exist</p>;
  }

  return (
    <Menu title="Game details">
      <Loading loading={renameLoading}>
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
        <ErrorText error={renameError} />
        <InputDialog
          wide
          onInput={renameRequest}
          message="Rename game"
          initialValue={game.displayName}
          className="GameDetails-button"
        >
          Rename <Icon icon={pencil} />
        </InputDialog>
        <GameInvite className="GameDetails-button" game={game} />
      </Loading>
    </Menu>
  );
};

export default memo(GameDetails);
