import React, { FunctionComponent, memo, useState, useCallback } from 'react';
import './UI.css';
import Settings from '../data/Settings';
import Button from '../components/Button';

interface Props {
  settings: Settings;
  endGame: () => void;
}

const UI: FunctionComponent<Props> = ({ endGame }): JSX.Element => {
  const [open, setOpen] = useState(true);
  const close = useCallback(() => setOpen(false), [setOpen]);

  return (
    <div className="UI-ui">
      <div className="UI-view">
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
