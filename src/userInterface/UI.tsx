import React, { FunctionComponent, memo, useCallback, useState } from 'react';
import Button from '../components/Button';
import './UI.css';

interface Props {
  ready: boolean;
  endGame: () => void;
}

const UI: FunctionComponent<Props> = ({ endGame, ready }): JSX.Element => {
  const [open, setOpen] = useState(true);
  const close = useCallback(() => setOpen(false), [setOpen]);

  return (
    <div className={`UI-ui ${ready ? 'UI-ready' : ''}`}>
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
