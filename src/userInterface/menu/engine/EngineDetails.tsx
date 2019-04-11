import Axios from 'axios';
import React, { FunctionComponent, memo, useCallback } from 'react';
import Icon from 'react-icons-kit';
import { check } from 'react-icons-kit/fa/check';
import { rocket } from 'react-icons-kit/fa/rocket';
import { times } from 'react-icons-kit/fa/times';
import { cog } from 'react-icons-kit/fa/cog';
import { trash } from 'react-icons-kit/fa/trash';
import { pencil } from 'react-icons-kit/fa/pencil';
import useDispatch from '../../../logic/useDispatch';
import useRequest from '../../../logic/useRequest';
import useStore from '../../../logic/useStore';
import Button from '../../components/Button';
import ErrorText from '../../components/ErrorText';
import Menu from '../Menu';
import './EngineDetails.css';
import Game from '../../../data/Game';
import Confirm from '../../components/Confirm';
import InputDialog from '../../components/InputDialog';

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

  const [deleteRequest, deleteLoading, deleteError] = useRequest(
    (gameId: string) =>
      Axios.post(`/api/engine/deleteGame/${engineId}`, { gameId }),
    (res, gameId) => {
      dispatch({ type: 'del_game', gameId, engineId });
    },
    [engineId]
  );
  const handleDelete = (game: Game) => () => {
    deleteRequest(game.id);
  };

  const [renameRequest, renameLoading, renameError] = useRequest(
    (name: string) => Axios.post(`/api/engine/rename/${engine!.id}`, { name }),
    (res, name) => {
      dispatch({ type: 'rename_engine', engine: engine!, name });
    },
    [engine]
  );

  if (!engine) {
    return <h1>This engine does not exist</h1>;
  }

  return (
    <Menu
      title="Engine"
      loading={abandonLoading || deleteLoading || renameLoading}
    >
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
                <Confirm
                  confirm={`Delete game ${game.displayName}?`}
                  size="small"
                  color="danger"
                  className="EngineDetails-gameControl"
                  onClick={handleDelete(game)}
                >
                  <Icon icon={trash} />
                </Confirm>
              </div>
            ))}
        </div>
      </div>
      <ErrorText error={abandonError || deleteError || renameError} />
      <Button className="EngineDetails-button" onClick={toCreateGame}>
        <Icon size={20} icon={rocket} className="EngineDetails-icon" />
        Create game
      </Button>
      <InputDialog
        onInput={renameRequest}
        message="Rename engine"
        initialValue={engine.name}
      >
        <Icon size={20} icon={pencil} className="EngineDetails-icon" />
        Rename engine
      </InputDialog>
      <Confirm
        confirm={`Abandon engine ${engine.name}?`}
        className="EngineDetails-button"
        onClick={abandon}
        color="danger"
      >
        <Icon size={20} icon={trash} className="EngineDetails-icon" />
        Abandon
      </Confirm>
    </Menu>
  );
};

export default memo(EngineDetails);
