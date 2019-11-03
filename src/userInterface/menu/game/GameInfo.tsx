import React, { FunctionComponent, memo } from 'react';
import Game from '../../../data/Game';
import './GameInfo.scss';

interface Props {
  game: Game;
}

const GameInfo: FunctionComponent<Props> = props => {
  const { game } = props;

  return (
    <div className="GameInfo-root">
      <h3>Game info</h3>
      <p>Name: {game.displayName}</p>
      <p>Owner: {game.owner}</p>
      <p>Players:</p>
      <ul>
        {game.players.map(player => (
          <li key={player}>{player}</li>
        ))}
      </ul>
    </div>
  );
};

export default memo(GameInfo);
