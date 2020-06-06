import React from 'react';

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
  return (
    <button className={classes.root} onClick={onClick} style={style} disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;
