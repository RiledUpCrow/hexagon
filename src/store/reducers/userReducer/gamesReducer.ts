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
      if (!state) {
        return state;
      }
      const { game } = action;
      return [...state, game];
    }
    case 'rename_game': {
      if (!state) {
        return state;
      }
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
    default:
      return state;
  }
};
