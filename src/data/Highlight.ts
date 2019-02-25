import { Position } from '../userInterface/UnitInfo';

export type HighlightType = 'range' | 'outline';

interface BaseHighlight {
  type: HighlightType;
}

export interface Range extends BaseHighlight {
  type: 'range';
  id: number;
  tiles: Position[];
  color: number;
}

export interface Outline extends BaseHighlight {
  type: 'outline';
  id: number;
  tiles: Position[];
  color: number;
}

export type Highlight = Range | Outline;
