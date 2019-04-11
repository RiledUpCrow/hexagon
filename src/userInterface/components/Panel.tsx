import React, { FunctionComponent, memo, ReactNode } from 'react';
import cn from 'classnames';
import './Panel.css';

interface Props {
  children?: ReactNode;
  className?: string;
}

const Panel: FunctionComponent<Props> = props => {
  const { children, className } = props;

  return <div className={cn('Panel-root', className)}>{children}</div>;
};

export default memo(Panel);
