import React from 'react';
import Panel from './Panel';
import ResetModal from './ResetModal';
import useAttack25 from '../hooks/useAttack25';
import './style/Attack25Board.css';

const Attack25Board: React.FC = () => {
  const {
    panels,
    currentTeam,
    teamNames,
    winners,
    showResetModal,
    setCurrentTeam,
    handlePanelClick,
    handleReset,
    confirmReset,
    cancelReset,
    handleTeamNameChange,
    setWinners,
    size,
    teamColors,
    history,
    setHistory,
    setPanels,
    canFlipPanel,
  } = useAttack25();

  return (
    <div className="attack25-board">
      {winners && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h1>Congratulations! {winners} win{winners.includes(',') ? '' : 's'}!</h1>
            <button className="button" onClick={() => setWinners(null)}>OK</button>
          </div>
        </div>
      )}

      {showResetModal && (
        <ResetModal confirmReset={confirmReset} cancelReset={cancelReset} />
      )}

      <div className="team-selection">
        {teamColors.map(color => (
          <div key={color} className="team">
            <div
              className={`team-color ${currentTeam === color ? 'selected' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => setCurrentTeam(color)}
            ></div>
            <input
              type="text"
              value={teamNames[color]}
              onChange={(e) => handleTeamNameChange(color, e.target.value)}
              className="team-input"
            />
          </div>
        ))}
        <button className="button" onClick={handleReset}>Reset</button>
        <button className="button" onClick={() => {
          if (history.length > 1) {
            setHistory(history.slice(0, -1));
            setPanels(history[history.length - 2]);
          }
        }}>Undo</button>
      </div>
      <div className="board" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
        {panels.map((row, rowIndex) =>
          row.map((panel, colIndex) => (
            <Panel
              key={`${rowIndex}-${colIndex}`}
              panel={panel}
              canFlip={canFlipPanel(rowIndex, colIndex)}
              handleClick={() => handlePanelClick(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Attack25Board;
