import React, { FunctionComponent, useCallback } from 'react';
import './Button.css';
import { buttonClick } from '../logic/sound';

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
  const handleClick = useCallback(() => {
    buttonClick.play();
    onClick();
  }, [onClick]);
  return (
    <button
      disabled={disabled}
      className={`Button-button Button-${size} ${wide ? 'Button-wide' : ''}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default Button;
