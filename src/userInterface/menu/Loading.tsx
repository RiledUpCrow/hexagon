import React, { FunctionComponent, memo, ReactNode } from 'react';
import Loader from '../components/Loader';
import './Loading.css';

interface Props {
  loading: boolean;
  children: ReactNode;
  className?: string;
}

const Loading: FunctionComponent<Props> = props => {
  const { loading, children, className } = props;

  return (
    <div className={`Loading-root ${className}`}>
      {children}
      {loading && (
        <div className="Loading-loader">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default memo(Loading);
