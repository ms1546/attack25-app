import React from 'react';
import './style/Panel.css';

interface PanelProps {
  panel: {
    color: string | null;
    number: number | null;
  };
  canFlip: boolean;
  handleClick: () => void;
}

const Panel: React.FC<PanelProps> = ({ panel, canFlip, handleClick }) => {
  return (
    <div
      className={`panel ${canFlip ? 'can-flip' : ''} ${panel.color ? 'flipped' : ''}`}
      onClick={handleClick}
      style={{ backgroundColor: panel.color || (canFlip ? '#555' : '#444') }}
    >
      {panel.number}
    </div>
  );
}

export default Panel;
