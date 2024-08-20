import React from 'react';
import Panel from './Panel';
import ResetModal from './ResetModal';
import useAttack25 from '../hooks/useAttack25';

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
    <div className="flex flex-col items-center min-h-screen bg-black text-white p-5">
      {winners && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-900 text-white p-8 rounded-lg text-center shadow-lg">
            <h1 className="text-2xl mb-4">
              Congratulations! {winners} win{winners.includes(',') ? '' : 's'}!
            </h1>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => setWinners(null)}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {showResetModal && (
        <ResetModal confirmReset={confirmReset} cancelReset={cancelReset} />
      )}

      <div className="flex gap-2 mb-5">
        {teamColors.map((color) => (
          <div key={color} className="text-center">
            <div
              className={`w-12 h-12 border ${
                currentTeam === color
                  ? 'border-4 border-white'
                  : 'border-gray-500'
              } cursor-pointer mb-2`}
              style={{ backgroundColor: color }}
              onClick={() => setCurrentTeam(color)}
            ></div>
            <input
              type="text"
              value={teamNames[color]}
              onChange={(e) => handleTeamNameChange(color, e.target.value)}
              className="w-20 text-center bg-gray-700 text-white border-none"
            />
          </div>
        ))}
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          onClick={() => {
            if (history.length > 1) {
              setHistory(history.slice(0, -1));
              setPanels(history[history.length - 2]);
            }
          }}
        >
          Undo
        </button>
      </div>

      <div
        className="grid gap-0.5 w-[90vw] h-[90vh] max-h-[calc(100vh-100px)] bg-black"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {panels.map((row, rowIndex) =>
          row.map((panel, colIndex) => (
            <Panel
              key={`${rowIndex}-${colIndex}`}
              panel={panel}
              canFlip={canFlipPanel(rowIndex, colIndex)}
              handleClick={() => handlePanelClick(rowIndex, colIndex)}
            />
          )),
        )}
      </div>
    </div>
  );
};

export default Attack25Board;
