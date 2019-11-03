import React, { FunctionComponent, memo, useCallback } from 'react';
import Engine from '../../../data/Engine';
import useDispatch from '../../../logic/useDispatch';
import Button from '../../components/Button';
import './EngineItem.css';

interface Props {
  engine: Engine;
}

const EngineItem: FunctionComponent<Props> = props => {
  const { engine } = props;

  const dispatch = useDispatch();

  const toEngine = useCallback(
    () => dispatch({ type: 'navigate', view: 'engine', param: engine.id }),
    [engine, dispatch]
  );

  return (
    <Button
      size="large"
      color="secondary"
      className="EngineItem-root"
      onClick={toEngine}
    >
      {engine.name}: {engine.online ? 'Online' : 'Offline'}
    </Button>
  );
};

export default memo(EngineItem);
