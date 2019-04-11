import React, { FunctionComponent, useCallback, KeyboardEvent } from 'react';
import './Button.scss';
import { buttonClick } from '../../logic/sound';
import cn from 'classnames';

type Size = 'small' | 'normal' | 'large';
type Color = 'primary' | 'secondary' | 'danger';

export interface ButtonProps {
  size?: Size;
  wide?: boolean;
  disabled?: boolean;
  className?: string;
  color?: Color;
  onClick?: () => void;
}

const Button: FunctionComponent<ButtonProps> = ({
  size = 'normal',
  wide = false,
  disabled = false,
  onClick = () => {},
  children,
  color = 'primary',
  className = '',
}): JSX.Element => {
  const handleClick = useCallback(() => {
    if (disabled) {
      return;
    }
    buttonClick.play();
    onClick();
  }, [onClick]);

  const handleKey = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      // eslint-disable-next-line default-case
      switch (event.key) {
        case 'Enter':
        case ' ': {
          handleClick();
        }
      }
    },
    [handleClick]
  );

  // `Button-content Button-${size} Button-${color} ${disabled &&
  //   'Button-disabled'} ${className}`

  return (
    <div
      tabIndex={disabled ? undefined : 0}
      className={cn('Button-button', wide && 'Button-wide', className)}
      onKeyPress={handleKey}
    >
      <span
        className={cn(
          'Button-content',
          `Button-${size}`,
          `Button-${color}`,
          disabled && 'Button-disabled'
        )}
        tabIndex={-1}
        onClick={handleClick}
      >
        {children}
      </span>
    </div>
  );
};

export default Button;
