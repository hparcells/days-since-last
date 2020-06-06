import React from 'react';
import clsx from 'clsx';

import classes from './Button.module.scss';

function Button({
  children,
  style,
  disabled,
  onClick
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  disabled?: boolean;
  onClick: () => any;
}) {
  function handleClick() {
    if (!disabled) {
      onClick();
    }
  }

  return (
    <button
      className={clsx(classes.root, disabled && classes.disabled)}
      onClick={handleClick}
      style={style}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
