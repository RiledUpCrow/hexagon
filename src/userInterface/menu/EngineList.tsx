import Axios from 'axios';
import React, { FunctionComponent, memo, useCallback, useState } from 'react';
import useDispatch from '../../logic/useDispatch';
import useRequest from '../../logic/useRequest';
import useStore from '../../logic/useStore';
import Button from '../components/Button';
import ErrorText from '../components/ErrorText';
import Loader from '../components/Loader';
import TextInput from '../components/TextInput';
import EngineItem from './EngineItem';
import './EngineList.css';

const EngineList: FunctionComponent = () => {
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

  const doClaim = useCallback(() => claimRequest(claim), [claim]);

  const back = useCallback(() => dispatch({ type: 'back' }), []);

  return (
    <div className="EngineList-root">
      <h1 className="EngineList-title">Engines</h1>
      <div className="EngineList-claim">
        <div className="EngineList-claimInput">
          <TextInput
            label="Claim engine"
            value={claim}
            onChange={setClaim}
            disabled={claimLoading}
            onEnter={doClaim}
          />
          <div className="EngineList-claimButton">
            <Button disabled={claimLoading} onClick={doClaim}>
              Claim
            </Button>
          </div>
        </div>
        <ErrorText error={claimError} />
        {claimLoading && (
          <div className="EngineList-loader">
            <Loader />
          </div>
        )}
      </div>
      <div className="EngineList-engines">
        {user.engines.map(engine => {
          return <EngineItem key={engine.id} engine={engine} />;
        })}
      </div>
      <Button className="EngineList-button" onClick={back}>
        Back
      </Button>
    </div>
  );
};

export default memo(EngineList);
