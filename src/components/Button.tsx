import React, { FunctionComponent } from 'react';
import './Button.css';

type Size = 'small' | 'normal' | 'large';

interface Props {
  size?: Size;
  wide?: boolean;
  onClick: () => void;
}

const Button: FunctionComponent<Props> = ({
  size = 'normal',
  wide = false,
  onClick,
  children,
}): JSX.Element => {
  return (
    <button
      className={`button ${size} ${wide ? 'wide' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
