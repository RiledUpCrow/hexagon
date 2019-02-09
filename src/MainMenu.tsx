import React, { FunctionComponent, memo, useCallback } from 'react';
import './MainMenu.css';
import Settings, { defaultSettings } from './Settings';
import Button from './components/Button';

interface Props {
  startGame: (settings: Settings) => void;
}

const MainMenu: FunctionComponent<Props> = ({ startGame }): JSX.Element => {
  const handleStart = useCallback(() => {
    startGame(defaultSettings);
  }, [startGame]);

  return (
    <div className="root">
      <h1 className="title">Settings</h1>
      <div className="settings">hehe</div>
      <div className="start">
        <Button size="large" wide onClick={handleStart}>
          Start
        </Button>
      </div>
    </div>
  );
};

export default memo(MainMenu);
