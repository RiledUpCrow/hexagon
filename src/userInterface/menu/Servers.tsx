import Axios, { AxiosError } from 'axios';
import React, { FunctionComponent, memo, useCallback, useState } from 'react';
import Button from '../../components/Button';
import ErrorText from '../../components/ErrorText';
import Loader from '../../components/Loader';
import TextInput from '../../components/TextInput';
import Engine from '../../data/Engine';
import useDispatch from '../../logic/useDispatch';
import useStore from '../../logic/useStore';
import './Servers.css';

const Servers: FunctionComponent = () => {
  const user = useStore(s => s.user)!;
  const dispatch = useDispatch();

  const [claim, setClaim] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const doClaim = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await Axios.post(
        '/api/engine/claim',
        {
          adminToken: claim,
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const engine: Engine = response.data;
      dispatch({ type: 'add_engine', engine });
      setClaim('');
    } catch (error) {
      setLoading(false);
      const ae = error as AxiosError;
      if (ae.response) {
        if (ae.response.status === 400) {
          setError(ae.response.data.message);
        } else {
          setError("This didn't work, probably a backend bug");
        }
      } else if (ae.request) {
        setError('No connection');
      } else {
        setError("This didn't work, probably a frontend bug");
      }
    }
    setLoading(false);
  }, [claim]);

  const doAbandon = (id: string) => async () => {
    setLoading(true);
    try {
      await Axios.post(
        '/api/engine/abandon',
        { id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      dispatch({ type: 'del_engine', engineId: id });
    } catch (error) {
      setLoading(false);
      const ae = error as AxiosError;
      if (ae.response) {
        if (ae.response.status === 400) {
          setError(ae.response.data.message);
        } else {
          setError("This didn't work, probably a backend bug");
        }
      } else if (ae.request) {
        setError('No connection');
      } else {
        setError("This didn't work, probably a frontend bug");
      }
    }
    setLoading(false);
  };

  return (
    <div className="Servers-root">
      <h1 className="Servers-title">Servers</h1>
      <div className="Servers-claim">
        <div className="Servers-claimInput">
          <TextInput label="Claim server" value={claim} onChange={setClaim} />
          <div className="Servers-claimButton">
            <Button disabled={loading} onClick={doClaim}>
              Claim
            </Button>
          </div>
        </div>
        <ErrorText error={error} />
        {loading && (
          <div className="Servers-loader">
            <Loader />
          </div>
        )}
      </div>
      {user.engines.map(engine => {
        return (
          <p key={engine.id}>
            {engine.id}: {engine.online ? 'Online' : 'Offline'}{' '}
            <Button size="small" onClick={doAbandon(engine.id)}>
              X
            </Button>
          </p>
        );
      })}
    </div>
  );
};

export default memo(Servers);
