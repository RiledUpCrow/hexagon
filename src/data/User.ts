import Game from './Game';
import Engine from './Engine';

export default interface User {
  name: string;
  photo?: string;
  token: string;
  engines: Engine[];
  games: Game[];
}
