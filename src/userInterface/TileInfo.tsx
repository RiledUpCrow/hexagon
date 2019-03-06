import React, { FunctionComponent, memo } from 'react';
import './TileInfo.css';
import { GroundType } from '../data/GroundType';
import Tile from '../data/Tile';

export interface Position {
  x: number;
  y: number;
}

interface Props {
  tile: Tile;
  position: Position;
}

const names: { [type in GroundType]: string } = {
  DESERT: 'Desert',
  GRASSLAND: 'Grassland',
  MOUNTAIN: 'Mountains',
  PLAINS: 'Plains',
  SNOW: 'Snow',
  TUNDRA: 'Tundra',
  OCEAN: 'Ocean',
};

const TileInfo: FunctionComponent<Props> = ({
  tile,
  position,
}): JSX.Element => {
  const name = names[tile.groundType] + (tile.hill ? ', Hill' : '');
  return (
    <div className="TileInfo-root">
      <h1 className="TileInfo-title">{name}</h1>
      <p className="TileInfo-position">
        {position.x}, {position.y}
      </p>
    </div>
  );
};

export default memo(TileInfo);
