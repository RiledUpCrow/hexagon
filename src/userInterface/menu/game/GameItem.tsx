import React, { FunctionComponent, memo, useCallback } from 'react';
import Icon from 'react-icons-kit';
import { cog } from 'react-icons-kit/fa/cog';
import Game from '../../../data/Game';
import useDispatch from '../../../logic/useDispatch';
import Button from '../../components/Button';
import './GameItem.css';

interface Props {
  game: Game;
  onStart: () => void;
}

const GameItem: FunctionComponent<Props> = props => {
  const { game, onStart } = props;
  const dispatch = useDispatch();
  const toGameDetails = useCallback(
    () =>
      dispatch({
        type: 'navigate',
        view: 'game',
        param: game.id,
      }),
    [game, dispatch]
  );

  return (
    <div className="GameItem-root">
      <Button
        size="large"
        wide
        disabled={!game.online}
        color="secondary"
        onClick={onStart}
        className="GameItem-wide"
      >
        {game.displayName}
      </Button>
      <Button size="large" onClick={toGameDetails} className="GameItem-narrow">
        <Icon icon={cog} />
      </Button>
    </div>
  );
};

export default memo(GameItem);
