import React, { FunctionComponent } from 'react';
import './Button.css';

type Size = 'small' | 'normal' | 'large';

interface Props {
  size?: Size;
  wide?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const Button: FunctionComponent<Props> = ({
  size = 'normal',
  wide = false,
  disabled = false,
  onClick,
  children,
}): JSX.Element => {
  return (
    <button
      disabled={disabled}
      className={`Button-button Button-${size} ${wide ? 'Button-wide' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
