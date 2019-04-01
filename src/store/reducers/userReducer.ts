import User from '../../data/User';
import { GameAction } from '../actions';
import Game from '../../data/Game';

export type UserState = User | null;

const defaultState: UserState = null;

const userReducer = (
  state: UserState = defaultState,
  action: GameAction
): UserState => {
  switch (action.type) {
    case 'login': {
      const { user } = action;
      return user;
    }
    case 'logout': {
      return defaultState;
    }
    case 'add_engine': {
      if (!state) {
        return state;
      }
      const { engine } = action;
      const newUser = { ...state, engines: [...state.engines, engine] };
      return newUser;
    }
    case 'del_engine': {
      if (!state) {
        return state;
      }
      const { engineId } = action;
      const index = state.engines.findIndex(e => e.id === engineId);
      if (index < 0) {
        return state;
      }
      const newUser = { ...state, engines: [...state.engines] };
      newUser.engines.splice(index, 1);
      return newUser;
    }
    case 'add_game': {
      if (!state) {
        return state;
      }
      const { game } = action;
      const newUser = { ...state, games: [...state.games, game] };
      return newUser;
    }
    case 'rename_game': {
      if (!state) {
        return state;
      }
      const { game, name } = action;
      const gameIndex = state.games.findIndex(g => g.id === game.id);
      if (gameIndex < 0) {
        return state;
      }
      const newUser = { ...state, games: [...state.games] };
      const newGame: Game = { ...game, displayName: name };
      newUser.games.splice(gameIndex, 1, newGame);
      return newUser;
    }
    default: {
      return state;
    }
  }
};

export default userReducer;
