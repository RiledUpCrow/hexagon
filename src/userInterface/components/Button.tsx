import React, { FunctionComponent, useCallback } from 'react';
import './Button.scss';
import { buttonClick } from '../../logic/sound';

type Size = 'small' | 'normal' | 'large';
type Color = 'primary' | 'secondary' | 'danger';

interface Props {
  size?: Size;
  wide?: boolean;
  disabled?: boolean;
  className?: string;
  color?: Color;
  onClick: () => void;
}

const Button: FunctionComponent<Props> = ({
  size = 'normal',
  wide = false,
  disabled = false,
  onClick,
  children,
  color = 'primary',
  className = '',
}): JSX.Element => {
  const handleClick = useCallback(() => {
    buttonClick.play();
    onClick();
  }, [onClick]);
  return (
    <button
      disabled={disabled}
      className={`Button-button Button-${size} ${
        wide ? 'Button-wide' : ''
      } Button-${color} ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default Button;
