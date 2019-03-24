import React, { FunctionComponent, memo, ReactNode, useCallback } from 'react';
import useDispatch from '../../logic/useDispatch';
import Button from '../components/Button';
import Loading from './Loading';
import './Menu.css';

interface Props {
  children: ReactNode;
  title: string;
  loading: boolean;
}

const Menu: FunctionComponent<Props> = props => {
  const { children, title, loading } = props;

  const dispatch = useDispatch();
  const back = useCallback(() => dispatch({ type: 'back' }), []);

  return (
    <div className="Menu-root">
      <h1 className="Menu-title">{title}</h1>
      <Loading loading={loading} className="Menu-content">
        {children}
      </Loading>
      <Button className="Menu-button" onClick={back}>
        Back
      </Button>
    </div>
  );
};

export default memo(Menu);
