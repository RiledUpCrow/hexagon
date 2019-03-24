import React, { FunctionComponent, memo, useCallback } from 'react';
import Engine from '../../data/Engine';
import useDispatch from '../../logic/useDispatch';
import './EngineItem.css';
import Button from '../components/Button';

interface Props {
  engine: Engine;
}

const EngineItem: FunctionComponent<Props> = props => {
  const { engine } = props;

  const dispatch = useDispatch();

  const toEngine = useCallback(
    () => dispatch({ type: 'navigate', view: 'engine', param: engine.id }),
    [engine]
  );

  return (
    <Button color="secondary" className="EngineItem-root" onClick={toEngine}>
      {engine.name}: {engine.online ? 'Online' : 'Offline'}
    </Button>
  );
};

export default memo(EngineItem);
