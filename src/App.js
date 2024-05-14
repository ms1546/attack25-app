import React, { useState, useEffect, useCallback, useMemo } from 'react';

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
  const [teamNames, setTeamNames] = useState({
    red: 'Red Team',
    blue: 'Blue Team',
    green: 'Green Team',
    yellow: 'Yellow Team'
  });
  const [winner, setWinner] = useState(null);

  const teamColors = useMemo(() => ['red', 'blue', 'green', 'yellow'], []);

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

    if (newPanels.flat().every(panel => panel.color !== null)) {
      declareWinner(newPanels);
    }
  };

  const declareWinner = useCallback((panels) => {
    const colorCount = {};
    teamColors.forEach(color => {
      colorCount[color] = panels.flat().filter(panel => panel.color === color).length;
    });

    const maxCount = Math.max(...Object.values(colorCount));
    const winningTeam = Object.keys(colorCount).find(color => colorCount[color] === maxCount);
    setWinner(teamNames[winningTeam]);
  }, [teamColors, teamNames]);

  const handleReset = () => {
    if (window.confirm('Resetしますか？')) {
      setPanels(initialPanels());
      setHistory([initialPanels()]);
      setWinner(null);
    }
  };

  const handleTeamNameChange = (color, name) => {
    setTeamNames(prevNames => ({
      ...prevNames,
      [color]: name
    }));
  };

  useEffect(() => {
    if (panels.flat().every(panel => panel.color !== null)) {
      declareWinner(panels);
    }
  }, [panels, declareWinner]);

  return (
    <div>
      {winner && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <h1>Congratulations! {winner} wins!</h1>
            <button onClick={() => setWinner(null)}>OK</button>
          </div>
        </div>
      )}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        {teamColors.map(color => (
          <div key={color} style={{ textAlign: 'center' }}>
            <div
              onClick={() => setCurrentTeam(color)}
              style={{
                width: '50px',
                height: '50px',
                backgroundColor: color,
                border: currentTeam === color ? '3px solid black' : '1px solid grey',
                cursor: 'pointer',
                marginBottom: '5px'
              }}
            ></div>
            <input
              type="text"
              value={teamNames[color]}
              onChange={(e) => handleTeamNameChange(color, e.target.value)}
              style={{ width: '80px', textAlign: 'center' }}
            />
          </div>
        ))}
        <button onClick={handleReset}>Reset</button>
        <button onClick={() => {
          if (history.length > 1) {
            setHistory(history.slice(0, -1));
            setPanels(history[history.length - 2]);
          }
        }}>Undo</button>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gap: '2px',
        width: '100vw',
        height: '100vh',
        maxHeight: 'calc(100vh - 100px)'
      }}>
        {panels.map((row, rowIndex) =>
          row.map((panel, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handlePanelClick(rowIndex, colIndex)}
              style={{
                width: '100%',
                height: '100%',
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
