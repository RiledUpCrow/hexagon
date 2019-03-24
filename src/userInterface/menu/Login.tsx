import React, { FunctionComponent, memo, useCallback, useState } from 'react';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import useDispatch from '../../logic/useDispatch';
import './Login.css';
import Axios, { AxiosError } from 'axios';
import User from '../../data/User';
import Loader from '../../components/Loader';
import ErrorText from '../../components/ErrorText';

const Login: FunctionComponent = (): JSX.Element => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const cancel = useCallback(() => dispatch({ type: 'back' }), []);
  const disabled = [loading, !username, !password].some(b => b);
  const login = useCallback(async () => {
    try {
      setError('');
      setLoading(true);
      const response = await Axios.post('/api/user/login', {
        name: username,
        password,
      });
      const { token, profile } = response.data;
      const user: User = {
        name: profile.name,
        photo: profile.photo,
        token,
        engines: profile.engines,
        games: profile.games,
      };
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'login', user });
      dispatch({ type: 'back' });
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
  }, [username, password]);

  return (
    <div className="Login-root">
      <h1 className="Login-title">Login</h1>
      <div className="Login-form">
        {loading && (
          <div className="Login-loader">
            <Loader />
          </div>
        )}
        <TextInput label="Username" value={username} onChange={setUsername} />
        <TextInput
          label="Password"
          value={password}
          onChange={setPassword}
          type="password"
        />
      </div>
      <ErrorText error={error} />
      <div className="Login-buttons">
        <div className="Login-button">
          <Button wide disabled={disabled} onClick={login}>
            Login
          </Button>
        </div>
        <div className="Login-button">
          <Button wide onClick={cancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(Login);
