import React, { FunctionComponent, memo, ReactNode } from 'react';
import './Panel.css';

interface Props {
  children?: ReactNode;
}

const Panel: FunctionComponent<Props> = props => {
  const { children } = props;

  return <div className="Panel-root">{children}</div>;
};

export default memo(Panel);
