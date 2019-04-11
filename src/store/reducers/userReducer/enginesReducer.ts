import Engine from '../../../data/Engine';
import { GameAction } from '../../actions';

export type EnginesState = Engine[];

const defaultState: EnginesState = [];

export default (
  state: EnginesState = defaultState,
  action: GameAction
): EnginesState => {
  switch (action.type) {
    case 'refresh_data': {
      const { engines } = action;
      return engines;
    }
    case 'add_engine': {
      const { engine } = action;
      return [...state, engine];
    }
    case 'rename_engine': {
      const { engine, name } = action;
      const engineIndex = state.findIndex(e => e.id === engine.id);
      if (engineIndex < 0) {
        return state;
      }
      const newState = [...state];
      const newEngine: Engine = { ...engine, name };
      newState.splice(engineIndex, 1, newEngine);
      return newState;
    }
    case 'add_game': {
      const { game, engineId } = action;
      const newState = [...state];
      const engineIndex = newState.findIndex(e => e.id === engineId);
      if (engineIndex < 0) {
        return state;
      }
      const newEngine: Engine = {
        ...newState[engineIndex],
        games: [...newState[engineIndex].games, game.id],
      };
      newState.splice(engineIndex, 1, newEngine);
      return newState;
    }
    case 'del_game': {
      const { gameId, engineId } = action;
      const newState = [...state];
      const engineIndex = newState.findIndex(e => e.id === engineId);
      if (engineIndex < 0) {
        return state;
      }
      const newEngine: Engine = {
        ...newState[engineIndex],
      };
      const newGames = [...newEngine.games];
      const gameIndex = newGames.findIndex(g => g === gameId);
      if (gameIndex < 0) {
        return state;
      }
      newGames.splice(gameIndex, 1);
      newEngine.games = newGames;
      newState.splice(engineIndex, 1, newEngine);
      return newState;
    }
    case 'del_engine': {
      const { engineId } = action;
      const index = state.findIndex(e => e.id === engineId);
      if (index < 0) {
        return state;
      }
      const newState = [...state];
      newState.splice(index, 1);
      return newState;
    }
    default:
      return state;
  }
};
