import React, { FunctionComponent, memo, useCallback, useState } from 'react';
import Button from '../components/Button';
import './UI.css';
import Tile from '../graphics/Tile';
import TileInfo, { Position } from './TileInfo';

export type TileData = {
  tile: Tile;
  position: Position;
} | null;

interface Props {
  ready: boolean;
  endGame: () => void;
  tile: TileData;
}

const UI: FunctionComponent<Props> = ({
  endGame,
  ready,
  tile,
}): JSX.Element => {
  const [open, setOpen] = useState(true);
  const close = useCallback(() => setOpen(false), [setOpen]);

  return (
    <div className={`UI-ui ${ready ? 'UI-ready' : ''}`}>
      <div className="UI-view">
        {tile && <TileInfo tile={tile.tile} position={tile.position} />}
        {open && (
          <div className="UI-paper">
            <h1 className="UI-title">This is UI</h1>
            <Button onClick={close}>Close</Button>
          </div>
        )}
      </div>
      <div className="UI-bar">
        <Button size="small" onClick={endGame}>
          Main menu
        </Button>
      </div>
    </div>
  );
};

export default memo(UI);
