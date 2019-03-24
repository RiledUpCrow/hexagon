import Axios from 'axios';
import React, { FunctionComponent, memo, useCallback } from 'react';
import Icon from 'react-icons-kit';
import { trash } from 'react-icons-kit/fa/trash';
import { check } from 'react-icons-kit/fa/check';
import { times } from 'react-icons-kit/fa/times';
import useDispatch from '../../logic/useDispatch';
import useRequest from '../../logic/useRequest';
import useStore from '../../logic/useStore';
import Button from '../components/Button';
import './EngineDetails.css';
import Loader from '../components/Loader';
import ErrorText from '../components/ErrorText';

interface Props {
  param: string;
}

const EngineDetails: FunctionComponent<Props> = props => {
  const { param: engineId } = props;
  const engine = useStore(s => s.user!.engines.find(e => e.id === engineId));
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
  const back = useCallback(() => dispatch({ type: 'back' }), []);

  if (!engine) {
    return <h1>This engine does not exist</h1>;
  }

  return (
    <div className="EngineDetails-root">
      <h1 className="EngineDetails-title">Engine</h1>
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
      <ErrorText error={abandonError} />
      <div className="EngineDetails-buttons">
        <Button
          className="EngineDetails-button"
          onClick={abandon}
          color="danger"
        >
          <Icon size={20} icon={trash} className="EngineDetails-icon" />
          Abandon
        </Button>
      </div>
      <Button className="EngineDetails-button" onClick={back}>
        Back
      </Button>
      {abandonLoading && (
        <div className="EngineDetails-loader">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default memo(EngineDetails);
