import Axios from 'axios';
import React, { FunctionComponent, memo, useCallback } from 'react';
import Icon from 'react-icons-kit';
import { check } from 'react-icons-kit/fa/check';
import { rocket } from 'react-icons-kit/fa/rocket';
import { times } from 'react-icons-kit/fa/times';
import { cog } from 'react-icons-kit/fa/cog';
import { trash } from 'react-icons-kit/fa/trash';
import useDispatch from '../../../logic/useDispatch';
import useRequest from '../../../logic/useRequest';
import useStore from '../../../logic/useStore';
import Button from '../../components/Button';
import ErrorText from '../../components/ErrorText';
import Menu from '../Menu';
import './EngineDetails.css';

interface Props {
  param: string;
}

const EngineDetails: FunctionComponent<Props> = props => {
  const { param: engineId } = props;
  const engine = useStore(s => s.user.engines.find(e => e.id === engineId));
  const games = useStore(s => s.user.games);
  const dispatch = useDispatch();
  const [abandonRequest, abandonLoading, abandonError] = useRequest(
    (id: string) => Axios.post('/api/engine/abandon', { id }),
    (res, id) => {
      dispatch({ type: 'del_engine', engineId: id });
      dispatch({ type: 'back' });
    },
    []
  );
  const abandon = useCallback(() => abandonRequest(engine!.id), [engine]);
  const toCreateGame = useCallback(
    () => dispatch({ type: 'navigate', view: 'createGame', param: engineId }),
    []
  );

  if (!engine) {
    return <h1>This engine does not exist</h1>;
  }

  return (
    <Menu title="Engine" loading={abandonLoading}>
      <div className="EngineDetails-line">
        <div>Name:</div>
        <div>{engine.name}</div>
      </div>
      <div className="EngineDetails-line">
        <div>Status:</div>
        {engine.online ? (
          <div>
            Online <Icon className="EngineDetails-online" icon={check} />
          </div>
        ) : (
          <div>
            Offline <Icon className="EngineDetails-offline" icon={times} />
          </div>
        )}
      </div>
      <div className="EngineDetails-line">
        <div>Games</div>
        <div>
          {engine.games
            .map(gameId => games.find(g => g.id === gameId)!)
            .map(game => (
              <div className="EngineDetails-gameControls">
                <span className="EngineDetails-gameName">
                  {game.displayName}{' '}
                </span>
                <Button
                  size="small"
                  className="EngineDetails-gameControl"
                  onClick={() =>
                    dispatch({
                      type: 'navigate',
                      view: 'game',
                      param: game.id,
                    })
                  }
                >
                  <Icon icon={cog} />
                </Button>
                <Button
                  size="small"
                  color="danger"
                  className="EngineDetails-gameControl"
                >
                  <Icon icon={trash} />
                </Button>
              </div>
            ))}
        </div>
      </div>
      <ErrorText error={abandonError} />
      <Button
        className="EngineDetails-button"
        onClick={toCreateGame}
        color="secondary"
      >
        <Icon size={20} icon={rocket} className="EngineDetails-icon" />
        Create game
      </Button>
      <Button className="EngineDetails-button" onClick={abandon} color="danger">
        <Icon size={20} icon={trash} className="EngineDetails-icon" />
        Abandon
      </Button>
    </Menu>
  );
};

export default memo(EngineDetails);
