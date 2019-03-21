import React, {
  FunctionComponent,
  memo,
  useState,
  useCallback,
  useMemo,
} from 'react';
import Axios from 'axios';
import './Register.css';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import useDispatch from '../../logic/useDispatch';
import User from '../../data/User';

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
      const response = await Axios.post('/user/register', {
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
      setError(error.message);
    }
  }, [username, email, password]);
  const cancel = useCallback(() => dispatch({ type: 'back' }), []);

  return (
    <div className="Register-root">
      <h1 className="Register-title">Register</h1>
      {Boolean(error) && <p className="Register-error">{error}</p>}
      <div className="Register-form">
        <div className="Register-input">
          <TextInput label="Username" value={username} onChange={setUsername} />
        </div>
        <div className="Register-input">
          <TextInput label="Email" value={email} onChange={setEmail} />
        </div>
        <div className="Register-input">
          <TextInput
            label="Password"
            value={password}
            onChange={setPassword}
            type="password"
          />
        </div>
        <div className="Register-input">
          <TextInput
            label="Repeat password"
            value={repeat}
            onChange={setRepeat}
            type="password"
          />
        </div>
        <div className="Register-buttons">
          <div className="Register-button">
            <Button disabled={disabled} onClick={register}>
              Register
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

export default memo(Register);
