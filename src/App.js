import React, { useState } from 'react';

function Attack25Board() {
  const size = 5;
  const initialPanels = () => {
    let panels = Array(size).fill(null).map(() => Array(size).fill({ color: null, number: null }));
    for (let i = 0, count = 1; i < size; i++) {
      for (let j = 0; j < size; j++) {
        panels[i][j] = { color: null, number: count++ };
      }
    }
    return panels;
  };

  const [panels, setPanels] = useState(initialPanels());
  const [currentTeam, setCurrentTeam] = useState('red');
  const [history, setHistory] = useState([initialPanels()]);
  const teamColors = ['red', 'blue', 'green', 'yellow'];

  const canFlipPanel = (row, col) => {
    if (panels[row][col].color !== null) return false;
    if (history.length === 1) return true;

    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];
    return directions.some(([dRow, dCol]) => {
      const r = row + dRow;
      const c = col + dCol;
      return r >= 0 && r < size && c >= 0 && c < size && panels[r][c].color !== null;
    });
  };

  const flipSurroundedPanels = (newPanels, row, col, color) => {
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1],
      [-1, -1], [1, 1], [-1, 1], [1, -1]
    ];

    directions.forEach(([dRow, dCol]) => {
      let line = [];
      let r = row + dRow;
      let c = col + dCol;

      while (r >= 0 && r < size && c >= 0 && c < size && newPanels[r][c].color && newPanels[r][c].color !== color) {
        line.push([r, c]);
        r += dRow;
        c += dCol;
      }

      if (r >= 0 && r < size && c >= 0 && c < size && newPanels[r][c].color === color) {
        line.forEach(([lr, lc]) => {
          newPanels[lr][lc].color = color;
        });
      }
    });
  };

  const handlePanelClick = (row, col) => {
    if (panels[row][col].color !== null || !canFlipPanel(row, col)) return;

    const newPanels = panels.map(row => row.map(panel => ({ ...panel })));
    newPanels[row][col].color = currentTeam;
    flipSurroundedPanels(newPanels, row, col, currentTeam);
    setPanels(newPanels);
    setHistory([...history, newPanels]);
  };

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        {teamColors.map(color => (
          <div
            key={color}
            onClick={() => setCurrentTeam(color)}
            style={{
              width: '50px',
              height: '50px',
              backgroundColor: color,
              border: currentTeam === color ? '3px solid black' : '1px solid grey',
              cursor: 'pointer'
            }}
          ></div>
        ))}
        <button onClick={() => { setPanels(initialPanels()); setHistory([initialPanels()]); }}>Reset Game</button>
        <button onClick={() => {
          if (history.length > 1) {
            setHistory(history.slice(0, -1));
            setPanels(history[history.length - 2]);
          }
        }}>Undo Move</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${size}, 50px)`, gap: '5px' }}>
        {panels.map((row, rowIndex) =>
          row.map((panel, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handlePanelClick(rowIndex, colIndex)}
              style={{
                width: '50px',
                height: '50px',
                backgroundColor: panel.color || (canFlipPanel(rowIndex, colIndex) ? 'lightgrey' : 'darkgrey'),
                color: 'black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: panel.color ? '1px solid ' + panel.color : '1px dashed grey',
                cursor: panel.color || !canFlipPanel(rowIndex, colIndex) ? 'not-allowed' : 'pointer',
                fontWeight: panel.color ? 'bold' : 'normal'
              }}
            >
              {panel.number}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Attack25Board;
