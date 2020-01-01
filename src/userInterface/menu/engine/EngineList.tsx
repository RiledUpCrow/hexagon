import Axios from 'axios';
import React, { FunctionComponent, memo, useCallback, useState } from 'react';
import useDispatch from '../../../logic/useDispatch';
import useRequest from '../../../logic/useRequest';
import useStore from '../../../logic/useStore';
import Button from '../../components/Button';
import ErrorText from '../../components/ErrorText';
import TextInput from '../../components/TextInput';
import Menu from '../Menu';
import EngineItem from './EngineItem';
import './EngineList.css';
import Icon from 'react-icons-kit';
import { paperPlane } from 'react-icons-kit/fa/paperPlane';

const EngineList: FunctionComponent = () => {
  const engines = useStore(s => s.user.engines);
  const dispatch = useDispatch();

  const [claim, setClaim] = useState('');

  const [claimRequest, claimLoading, claimError] = useRequest(
    (claim: string) => Axios.post('/api/engine/claim', { adminToken: claim }),
    res => {
      const { engine, games } = res.data;
      dispatch({ type: 'add_engine', engine, games });
      setClaim('');
    },
    []
  );

  const doClaim = useCallback(() => claimRequest(claim), [claim, claimRequest]);

  return (
    <Menu title="Engines" loading={claimLoading}>
      <div className="EngineList-claim">
        <div className="EngineList-claimInput">
          <TextInput
            label="Claim engine"
            value={claim}
            onChange={setClaim}
            disabled={claimLoading}
            onEnter={doClaim}
            button={
              <Button disabled={claimLoading} onClick={doClaim} size="small">
                Claim{' '}
                <Icon
                  size="1em"
                  icon={paperPlane}
                  style={{ cursor: 'pointer' }}
                />
              </Button>
            }
          />
          <div className="EngineList-claimButton" />
        </div>
        <ErrorText error={claimError} />
      </div>
      {engines.map(engine => {
        return <EngineItem key={engine.id} engine={engine} />;
      })}
    </Menu>
  );
};

export default memo(EngineList);
