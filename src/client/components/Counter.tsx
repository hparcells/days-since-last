import React from 'react';

function Counter({ value, label }: { value: number; label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        margin: '0em 1em'
      }}
    >
      <span style={{ fontSize: '36px' }}>{String(value).padStart(2, '0')}</span>
      <span>{label}</span>
    </div>
  );
}

export default Counter;
