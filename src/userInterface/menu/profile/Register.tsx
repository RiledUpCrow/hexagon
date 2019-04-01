import Axios from 'axios';
import React, {
  FunctionComponent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import User from '../../../data/User';
import useDispatch from '../../../logic/useDispatch';
import useRequest from '../../../logic/useRequest';
import Button from '../../components/Button';
import ErrorText from '../../components/ErrorText';
import Loader from '../../components/Loader';
import TextInput from '../../components/TextInput';
import './Login.css';
import './Register.css';

const Register: FunctionComponent = (): JSX.Element => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');

  const usernameInvalid = useMemo(() => false, [username]);
  const emailInvalid = useMemo(() => false, [email]);
  const passwordInvalid = useMemo(() => false, [password]);
  const repeatInvalid = useMemo(() => false, [repeat]);

  const dispatch = useDispatch();
  const [registerRequest, loading, error] = useRequest(
    (username: string, email: string, password: string) =>
      Axios.post('/api/user/register', {
        name: username,
        password,
        email,
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

  const disabled = [
    loading,
    usernameInvalid,
    emailInvalid,
    passwordInvalid,
    repeatInvalid,
    !username,
    !email,
    !password,
    !repeat,
  ].some(b => b);

  const register = useCallback(
    () => registerRequest(username, email, password),
    [username, email, password]
  );
  const cancel = useCallback(() => dispatch({ type: 'back' }), []);

  const usernameInput = useRef<HTMLInputElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const repeatInput = useRef<HTMLInputElement>(null);
  const focusUsername = useCallback(() => usernameInput.current!.focus(), []);
  const focusEmail = useCallback(() => emailInput.current!.focus(), []);
  const focusPassword = useCallback(() => passwordInput.current!.focus(), []);
  const focusRepeat = useCallback(() => repeatInput.current!.focus(), []);
  useEffect(() => {
    if (error) {
      focusUsername();
    }
  }, [error]);

  return (
    <div className="Login-root">
      <h1 className="Login-title">Register</h1>
      <div className="Login-form">
        {loading && (
          <div className="Login-loader">
            <Loader />
          </div>
        )}
        <TextInput
          inputRef={usernameInput}
          autoFocus
          disabled={loading}
          label="Username"
          value={username}
          onChange={setUsername}
          onEnter={focusEmail}
        />
        <TextInput
          inputRef={emailInput}
          disabled={loading}
          label="Email"
          value={email}
          onChange={setEmail}
          onEnter={focusPassword}
        />
        <TextInput
          inputRef={passwordInput}
          disabled={loading}
          label="Password"
          value={password}
          onChange={setPassword}
          type="password"
          onEnter={focusRepeat}
        />
        <TextInput
          inputRef={repeatInput}
          disabled={loading}
          label="Repeat password"
          value={repeat}
          onChange={setRepeat}
          type="password"
          onEnter={register}
        />
      </div>
      <ErrorText error={error} />
      <div className="Login-buttons">
        <div className="Login-button">
          <Button wide disabled={disabled} onClick={register}>
            Register
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

export default memo(Register);
