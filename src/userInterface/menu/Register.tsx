import Axios, { AxiosError } from 'axios';
import React, {
  FunctionComponent,
  memo,
  useCallback,
  useMemo,
  useState,
} from 'react';
import Button from '../../components/Button';
import ErrorText from '../../components/ErrorText';
import Loader from '../../components/Loader';
import TextInput from '../../components/TextInput';
import User from '../../data/User';
import useDispatch from '../../logic/useDispatch';
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

  const [loading, setLoading] = useState(false);

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

  const [error, setError] = useState('');

  const register = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Axios.post('/api/user/register', {
        name: username,
        password,
        email,
      });
      const { token, profile } = response.data;
      const user: User = {
        name: profile.name,
        photo: profile.photo,
        token,
      };
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'login', user });
      dispatch({ type: 'back' });
    } catch (error) {
      setLoading(false);
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
  }, [username, email, password]);
  const cancel = useCallback(() => dispatch({ type: 'back' }), []);

  return (
    <div className="Login-root">
      <h1 className="Login-title">Register</h1>
      <div className="Login-form">
        {loading && (
          <div className="Login-loader">
            <Loader />
          </div>
        )}
        <TextInput label="Username" value={username} onChange={setUsername} />
        <TextInput label="Email" value={email} onChange={setEmail} />
        <TextInput
          label="Password"
          value={password}
          onChange={setPassword}
          type="password"
        />
        <TextInput
          label="Repeat password"
          value={repeat}
          onChange={setRepeat}
          type="password"
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
