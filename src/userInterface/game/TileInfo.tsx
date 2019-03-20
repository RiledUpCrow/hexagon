import React, { FunctionComponent, memo } from 'react';
import { GroundType } from '../../data/GroundType';
import Position from '../../data/Position';
import Tile from '../../data/Tile';
import './TileInfo.css';

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
