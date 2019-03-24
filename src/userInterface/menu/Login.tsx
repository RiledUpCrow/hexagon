import Axios from 'axios';
import React, {
  FunctionComponent,
  memo,
  useCallback,
  useState,
  useRef,
  useEffect,
} from 'react';
import Button from '../../components/Button';
import ErrorText from '../../components/ErrorText';
import Loader from '../../components/Loader';
import TextInput from '../../components/TextInput';
import User from '../../data/User';
import useDispatch from '../../logic/useDispatch';
import useRequest from '../../logic/useRequest';
import './Login.css';

const Login: FunctionComponent = (): JSX.Element => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const [loginRequest, loading, error] = useRequest(
    (username: string, password: string) =>
      Axios.post('/api/user/login', {
        name: username,
        password,
      }),
    res => {
      const { token, profile } = res.data;
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
    },
    []
  );

  const disabled = [loading, !username, !password].some(b => b);

  const login = useCallback(() => loginRequest(username, password), [
    username,
    password,
  ]);
  const cancel = useCallback(() => dispatch({ type: 'back' }), []);

  const passwordInput = useRef<HTMLInputElement>(null);
  const focus = useCallback(() => passwordInput.current!.focus(), []);

  useEffect(() => {
    if (error) {
      focus();
    }
  }, [error]);

  return (
    <div className="Login-root">
      <h1 className="Login-title">Login</h1>
      <div className="Login-form">
        {loading && (
          <div className="Login-loader">
            <Loader />
          </div>
        )}
        <TextInput
          disabled={loading}
          autoFocus
          label="Username"
          value={username}
          onChange={setUsername}
          onEnter={focus}
        />
        <TextInput
          inputRef={passwordInput}
          disabled={loading}
          label="Password"
          value={password}
          onChange={setPassword}
          type="password"
          onEnter={login}
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
