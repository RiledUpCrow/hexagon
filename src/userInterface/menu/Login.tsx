import React, { FunctionComponent, memo, useCallback, useState } from 'react';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import useDispatch from '../../logic/useDispatch';
import './Login.css';
import Axios from 'axios';
import User from '../../data/User';

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
      setLoading(true);
      const response = await Axios.post('/user/login', {
        name: username,
        password,
      });
      const { token, profile } = response.data;
      const user: User = {
        name: profile.name,
        photo: profile.photo,
        token,
      };
      dispatch({ type: 'login', user });
      dispatch({ type: 'back' });
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  }, [username, password]);

  return (
    <div className="Login-root">
      <h1 className="Login-title">Login</h1>
      {Boolean(error) && <p className="Login-error">{error}</p>}
      <div className="Login-form">
        <div className="Login-input">
          <TextInput label="Username" value={username} onChange={setUsername} />
        </div>
        <div className="Login-input">
          <TextInput label="Password" value={password} onChange={setPassword} />
        </div>
        <div className="Login-buttons">
          <div className="Login-button">
            <Button disabled={disabled} onClick={login}>
              Login
            </Button>
          </div>
          <div>
            <Button onClick={cancel}>Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Login);
