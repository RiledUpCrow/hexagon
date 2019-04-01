interface Settings {
  maxPlayers: number;
  mapWidth: number;
  mapHeight: number;
}

export default interface Game {
  id: string;
  displayName: string;
  started: boolean;
  ended: boolean;
  settings: Settings;
  players: string[];
  activePlayer: string | null;
  owner: string;
  online: boolean;
}
