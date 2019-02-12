import { combineReducers } from 'redux';
import selectedTileReducer, { SelectedTileState } from './selectedTileReducer';

export interface RootState {
  selectedTile: SelectedTileState;
}

export default combineReducers<RootState>({
  selectedTile: selectedTileReducer,
});
