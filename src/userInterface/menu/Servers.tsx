import Axios from 'axios';
import React, { FunctionComponent, memo, useState, useCallback } from 'react';
import Button from '../../components/Button';
import ErrorText from '../../components/ErrorText';
import Loader from '../../components/Loader';
import { Icon } from 'react-icons-kit';
import { trash } from 'react-icons-kit/fa/trash';
import TextInput from '../../components/TextInput';
import useDispatch from '../../logic/useDispatch';
import useRequest from '../../logic/useRequest';
import useStore from '../../logic/useStore';
import './Servers.css';

const Servers: FunctionComponent = () => {
  const user = useStore(s => s.user)!;
  const dispatch = useDispatch();

  const [claim, setClaim] = useState('');

  const [claimRequest, claimLoading, claimError] = useRequest(
    (claim: string) => Axios.post('/api/engine/claim', { adminToken: claim }),
    res => {
      dispatch({ type: 'add_engine', engine: res.data });
      setClaim('');
    },
    []
  );

  const [abandonRequest, abandonLoading, abandonError] = useRequest(
    (id: string) => Axios.post('/api/engine/abandon', { id }),
    (res, id) => dispatch({ type: 'del_engine', engineId: id }),
    []
  );

  const doClaim = useCallback(() => claimRequest(claim), [claim]);

  const back = useCallback(() => dispatch({ type: 'back' }), []);

  return (
    <div className="Servers-root">
      <h1 className="Servers-title">Servers</h1>
      <div className="Servers-claim">
        <div className="Servers-claimInput">
          <TextInput
            label="Claim server"
            value={claim}
            onChange={setClaim}
            disabled={claimLoading}
            onEnter={doClaim}
          />
          <div className="Servers-claimButton">
            <Button disabled={claimLoading} onClick={doClaim}>
              Claim
            </Button>
          </div>
        </div>
        <ErrorText error={claimError || abandonError} />
        {(claimLoading || abandonLoading) && (
          <div className="Servers-loader">
            <Loader />
          </div>
        )}
      </div>
      {user.engines.map(engine => {
        return (
          <p key={engine.id}>
            {engine.id}: {engine.online ? 'Online' : 'Offline'}{' '}
            <Button
              disabled={abandonLoading}
              size="small"
              onClick={() => abandonRequest(engine.id)}
            >
              <Icon icon={trash} />
            </Button>
          </p>
        );
      })}
      <Button wide onClick={back}>
        Back
      </Button>
    </div>
  );
};

export default memo(Servers);
