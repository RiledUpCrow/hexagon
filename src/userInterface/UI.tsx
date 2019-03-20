import React, { FunctionComponent, memo, useCallback, useState } from 'react';
import Button from '../components/Button';
import useStore from '../logic/useStore';
import TileInfo from './game/TileInfo';
import UnitInfo from './game/UnitInfo';
import './UI.css';

interface Props {
  ready: boolean;
  endGame: () => void;
}

const UI: FunctionComponent<Props> = ({ endGame, ready }): JSX.Element => {
  const [open, setOpen] = useState(true);
  const close = useCallback(() => setOpen(false), [setOpen]);
  const tileData = useStore(s => s.selectedTile);
  const unitData = useStore(s => s.selectedUnit);

  return (
    <div className={`UI-ui ${ready ? 'UI-ready' : ''}`}>
      <div className="UI-view">
        {tileData && (
          <TileInfo tile={tileData.tile} position={tileData.position} />
        )}
        {unitData && <UnitInfo unit={unitData} />}
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
