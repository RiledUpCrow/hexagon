import { View } from '../../data/View';
import { GameAction } from '../actions';

interface Route {
  view: View;
  param?: string;
}

export interface RouteState {
  current: Route;
  stack: Route[];
}

export const defaultState: RouteState = {
  current: { view: 'mainMenu' },
  stack: [],
};

export default (
  state: RouteState = defaultState,
  action: GameAction
): RouteState => {
  switch (action.type) {
    case 'navigate': {
      const { view, param } = action;
      const newStack = [...state.stack, state.current];
      return {
        current: { view, param },
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
