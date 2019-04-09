import { combineReducers } from 'redux';
import enginesReducer, { EnginesState } from './enginesReducer';
import gamesReducer, { GamesState } from './gamesReducer';
import profileReducer, { ProfileState } from './profileReducer';

export interface UserState {
  profile: ProfileState;
  games: GamesState;
  engines: EnginesState;
}

export default combineReducers<UserState>({
  profile: profileReducer,
  games: gamesReducer,
  engines: enginesReducer,
});
