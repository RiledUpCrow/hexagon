import { Highlight } from '../../data/Highlight';
import { AnyAction } from 'redux';

export type HighlightState = Highlight[];

const defaultState: HighlightState = [
  {
    type: 'outline',
    id: 0,
    tiles: [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }],
    color: 0x09efc8,
  },
  {
    type: 'range',
    id: 1,
    tiles: [
      { x: 12, y: 10 },
      { x: 12, y: 11 },
      { x: 13, y: 11 },
      { x: 14, y: 12 },
    ],
    color: 0xed7b10,
  },
];

export default (
  state: HighlightState = defaultState,
  action: AnyAction
): HighlightState => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};
