import Game from '../../../data/Game';
import { GameAction } from '../../actions';

export type GamesState = Game[];

const defaultState: GamesState = [];

export default (
  state: GamesState = defaultState,
  action: GameAction
): GamesState => {
  switch (action.type) {
    case 'refresh_data': {
      const { games } = action;
      return games;
    }
    case 'add_game': {
      const { game } = action;
      return [...state, game];
    }
    case 'del_game': {
      const { gameId } = action;
      const gameIndex = state.findIndex(g => g.id === gameId);
      if (gameIndex < 0) {
        return state;
      }
      const newState = [...state];
      newState.splice(gameIndex, 1);
      return newState;
    }
    case 'rename_game': {
      const { game, name } = action;
      const gameIndex = state.findIndex(g => g.id === game.id);
      if (gameIndex < 0) {
        return state;
      }
      const newState = [...state];
      const newGame: Game = { ...game, displayName: name };
      newState.splice(gameIndex, 1, newGame);
      return newState;
    }
    case 'add_engine': {
      const { games } = action;
      return [...state, ...games];
    }
    default:
      return state;
  }
};
