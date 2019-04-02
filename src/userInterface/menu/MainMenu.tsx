import React, { FunctionComponent, memo, useCallback } from 'react';
import Button from '../components/Button';
import { View } from '../../data/View';
import useDispatch from '../../logic/useDispatch';
import useStore from '../../logic/useStore';
import './MainMenu.css';

const MainMenu: FunctionComponent = (): JSX.Element => {
  const user = useStore(s => s.user);
  const dispatch = useDispatch();

  const navigate = (view: View): (() => void) => () =>
    dispatch({ type: 'navigate', view });
  const toLogin = useCallback(navigate('login'), []);
  const toRegister = useCallback(navigate('register'), []);
  const toEngines = useCallback(navigate('listEngines'), []);
  const toGames = useCallback(navigate('listGames'), []);

  const logout = useCallback(() => {
    dispatch({ type: 'logout' });
    localStorage.removeItem('user');
  }, []);

  const button = (title: string, action: () => void): JSX.Element => (
    <div className="MainMenu-button">
      <Button size="large" wide onClick={action}>
        {title}
      </Button>
    </div>
  );

  return (
    <div className="MainMenu-root">
      <h1 className="MainMenu-title">The World Anew</h1>
      <div className="MainMenu-buttons">
        {!user && button('Login', toLogin)}
        {!user && button('Register', toRegister)}

        {user && button('Games', toGames)}
        {user && button('Engines', toEngines)}
        {user && button('Logout', logout)}
      </div>
    </div>
  );
};

export default memo(MainMenu);
