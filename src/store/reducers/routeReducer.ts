import { View } from '../../data/View';
import { GameAction } from '../actions';

export interface RouteState {
  current: View;
  stack: View[];
}

export const defaultState: RouteState = {
  current: 'mainMenu',
  stack: [],
};

export default (
  state: RouteState = defaultState,
  action: GameAction
): RouteState => {
  switch (action.type) {
    case 'navigate': {
      const { view } = action;
      const newStack = [...state.stack, state.current];
      return {
        current: view,
        stack: newStack,
      };
    }
    case 'back': {
      if (state.stack.length === 0) {
        return state;
      }
      const newStack = [...state.stack];
      const newCurrent = newStack.pop()!;
      return {
        current: newCurrent,
        stack: newStack,
      };
    }
    default: {
      return state;
    }
  }
};
