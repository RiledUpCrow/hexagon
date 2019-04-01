import React, { FunctionComponent, memo } from 'react';
import useStore from '../../../logic/useStore';
import Menu from '../Menu';
import './GameDetails.css';

interface Props {
  param: string;
}

const GameDetails: FunctionComponent<Props> = props => {
  const { param } = props;
  const game = useStore(s => s.user!.games.find(g => g.id === param));

  if (!game) {
    return <p>This game does not exist</p>;
  }

  return (
    <Menu title="Game details">
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
