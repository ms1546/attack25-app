import React from 'react';
import './Panel.css';

function Panel({ panel, canFlip, handleClick }) {
  return (
    <div
      className={`panel ${canFlip ? 'can-flip' : ''} ${panel.color ? 'flipped' : ''}`}
      onClick={handleClick}
      style={{ backgroundColor: panel.color || 'lightgrey' }}
    >
      {panel.number}
    </div>
  );
}

export default Panel;
