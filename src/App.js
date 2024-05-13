import React, { useState } from 'react';

function Attack25Board() {
  const size = 5;
  const initialPanels = () => {
    let panels = Array(size).fill(null).map(() => Array(size).fill({ color: null, number: null }));
    let count = 1;
    for (let i = 0; i < size; i++) {
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

  // 指定した方向にパネルを挟めるか確認し、挟める場合はパネルのリストを返す関数
  const checkDirection = (board, row, col, dRow, dCol, team) => {
    let r = row + dRow;
    let c = col + dCol;
    let toFlip = [];
    while (r >= 0 && r < size && c >= 0 && c < size && board[r][c].color && board[r][c].color !== team) {
      toFlip.push([r, c]);
      r += dRow;
      c += dCol;
    }
    if (r >= 0 && r < size && c >= 0 && c < size && board[r][c].color === team) {
      return toFlip;
    } else {
      return [];
    }
  };

  // 挟んで色を変えるロジック
  const flipPanels = (row, col, team, newPanels) => {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];
    let flippedAny = false;
    directions.forEach(([dRow, dCol]) => {
      let flips = checkDirection(newPanels, row, col, dRow, dCol, team);
      if (flips.length > 0) {
        flips.forEach(([fr, fc]) => {
          newPanels[fr][fc].color = team;
          flippedAny = true;
        });
      }
    });
    return flippedAny;
  };

  // パネルをクリックしたときの処理
  const handlePanelClick = (row, col) => {
    if (panels[row][col].color !== null) return; //

    let newPanels = panels.map(row => row.map(panel => ({ ...panel })));
    let canFlip = flipPanels(row, col, currentTeam, newPanels);
    if (canFlip || (row === 2 && col === 2 && panels[row][col].number === 13)) {
      newPanels[row][col].color = currentTeam;
      setPanels(newPanels);
      setHistory([...history, newPanels]);
      setCurrentTeam(teamColors[(teamColors.indexOf(currentTeam) + 1) % teamColors.length]);
    }
  };

  // リセット機能と一手戻す機能
  const resetGame = () => {
    if (window.confirm('Are you sure you want to reset the game?')) {
      setPanels(initialPanels());
      setHistory([initialPanels()]);
    }
  };

  const undoMove = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setPanels(newHistory[newHistory.length - 1]);
      setHistory(newHistory);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <label>Choose your team:</label>
        <select value={currentTeam} onChange={e => setCurrentTeam(e.target.value)}>
          {teamColors.map(color => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select>
        <button onClick={resetGame}>Reset Game</button>
        <button onClick={undoMove}>Undo Move</button>
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
                backgroundColor: panel.color || 'lightgrey', // 光る機能のために変更
                color: 'black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: panel.color ? '1px solid ' + panel.color : '1px dashed grey',
                cursor: 'pointer',
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
