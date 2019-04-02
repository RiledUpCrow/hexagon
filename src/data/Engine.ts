import Game from './Game';

export default interface Engine {
  id: string;
  online: boolean;
  name: string;
  games: Game[];
}
