import React from 'react';

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
      className={`flex items-center justify-center w-full h-full border ${
        panel.color ? 'font-bold cursor-not-allowed' : ''
      } ${
        canFlip
          ? 'border-gray-600 bg-white text-black'
          : 'bg-gray-300 text-black'
      } ${
        panel.color ? 'bg-gray-400 border-gray-700 text-black' : ''
      } transition-all duration-300`}
      onClick={handleClick}
      style={{ backgroundColor: panel.color || (canFlip ? '#ffffff' : '#cccccc') }}
    >
      {panel.number}
    </div>
  );
};

export default Panel;
