import React, { ComponentType, FunctionComponent, memo } from 'react';
import { View } from '../data/View';
import useStore from '../logic/useStore';
import Login from './menu/Login';
import MainMenu from './menu/MainMenu';
import Register from './menu/Register';
import EngineList from './menu/EngineList';
import EngineDetails from './menu/EngineDetails';
import CreateGame from './menu/CreateGame';

type Routes = { [key in View]?: ComponentType<{ param?: string }> };

/* eslint-disable @typescript-eslint/no-explicit-any */
const routes: Routes = {
  mainMenu: MainMenu as any,
  login: Login as any,
  register: Register as any,
  listEngines: EngineList as any,
  engine: EngineDetails as any,
  createGame: CreateGame as any,
};
/* eslint-enable @typescript-eslint/no-explicit-any */

const Content: FunctionComponent = (): JSX.Element => {
  const route = useStore(s => s.route.current);
  const Component = routes[route.view];

  if (!Component) {
    return <div />;
  }

  return <Component param={route.param} />;
};

export default memo(Content);
