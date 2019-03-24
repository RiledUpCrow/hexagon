import React, { FunctionComponent } from 'react';
import './ErrorText.css';

interface Props {
  error: string;
}

const ErrorText: FunctionComponent<Props> = ({ error }): JSX.Element => {
  return (
    <div className="Error-root">
      {error && <p className="Error-text">{error}</p>}
    </div>
  );
};

export default ErrorText;
