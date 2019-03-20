import { GameAction } from '../actions';
import GameData from '../../data/GameData';

export type GameState = GameData | null;

const defaultState: GameState = null;

export default (
  state: GameState = defaultState,
  action: GameAction
): GameState => {
  switch (action.type) {
    case 'start_game': {
      const { gameData } = action;
      return gameData;
    }
    case 'reset': {
      return defaultState;
    }
    default: {
      return state;
    }
  }
};
