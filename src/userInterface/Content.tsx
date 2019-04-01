import React, { ComponentType, FunctionComponent, memo } from 'react';
import { View } from '../data/View';
import useStore from '../logic/useStore';
import CreateGame from './menu/engine/CreateGame';
import EngineDetails from './menu/engine/EngineDetails';
import EngineList from './menu/engine/EngineList';
import GameList from './menu/game/GameList';
import MainMenu from './menu/MainMenu';
import Login from './menu/profile/Login';
import Register from './menu/profile/Register';

type Routes = { [key in View]?: ComponentType<{ param?: string }> };

/* eslint-disable @typescript-eslint/no-explicit-any */
const routes: Routes = {
  mainMenu: MainMenu as any,
  login: Login as any,
  register: Register as any,
  listEngines: EngineList as any,
  engine: EngineDetails as any,
  createGame: CreateGame as any,
  listGames: GameList as any,
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
