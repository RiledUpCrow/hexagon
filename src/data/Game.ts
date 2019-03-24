interface Settings {
  maxPlayers: number;
  mapWidth: number;
  mapHeight: number;
}

export default interface Game {
  id: string;
  started: boolean;
  ended: boolean;
  settings: Settings;
  players: string[];
  online: boolean;
}
