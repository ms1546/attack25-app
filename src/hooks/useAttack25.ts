import { useState, useEffect, useCallback, useMemo } from 'react';

interface Panel {
  color: string | null;
  number: number | null;
}

interface TeamNames {
  [key: string]: string;
}

const useAttack25 = () => {
  const size = 5;

  const initialPanels = (): Panel[][] => {
    let panels: Panel[][] = Array(size)
      .fill(null)
      .map(() => Array(size).fill({ color: null, number: null }));
    for (let i = 0, count = 1; i < size; i++) {
      for (let j = 0; j < size; j++) {
        panels[i][j] = { color: null, number: count++ };
      }
    }
    return panels;
  };

  const [panels, setPanels] = useState<Panel[][]>(initialPanels());
  const [currentTeam, setCurrentTeam] = useState<string>('red');
  const [history, setHistory] = useState<Panel[][][]>([initialPanels()]);
  const [teamNames, setTeamNames] = useState<TeamNames>({
    red: 'Red Team',
    blue: 'Blue Team',
    green: 'Green Team',
    yellow: 'Yellow Team',
  });
  const [winners, setWinners] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  const teamColors = useMemo(() => ['red', 'blue', 'green', 'yellow'], []);

  const canFlipPanel = (row: number, col: number): boolean => {
    if (panels[row][col].color !== null) return false;
    if (history.length === 1) return true;

    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    return directions.some(([dRow, dCol]) => {
      const r = row + dRow;
      const c = col + dCol;
      return (
        r >= 0 && r < size && c >= 0 && c < size && panels[r][c].color !== null
      );
    });
  };

  const flipSurroundedPanels = (
    newPanels: Panel[][],
    row: number,
    col: number,
    color: string,
  ) => {
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
      [-1, -1],
      [1, 1],
      [-1, 1],
      [1, -1],
    ];

    directions.forEach(([dRow, dCol]) => {
      let line: [number, number][] = [];
      let r = row + dRow;
      let c = col + dCol;

      while (
        r >= 0 &&
        r < size &&
        c >= 0 &&
        c < size &&
        newPanels[r][c].color &&
        newPanels[r][c].color !== color
      ) {
        line.push([r, c]);
        r += dRow;
        c += dCol;
      }

      if (
        r >= 0 &&
        r < size &&
        c >= 0 &&
        c < size &&
        newPanels[r][c].color === color
      ) {
        line.forEach(([lr, lc], index) => {
          setTimeout(
            () => {
              newPanels[lr][lc].color = color;
              setPanels([...newPanels]);
            },
            500 * (index + 1),
          );
        });
      }
    });
  };

  const handlePanelClick = (row: number, col: number) => {
    if (panels[row][col].color !== null || !canFlipPanel(row, col)) return;

    const newPanels = panels.map((row) => row.map((panel) => ({ ...panel })));
    newPanels[row][col].color = currentTeam;
    flipSurroundedPanels(newPanels, row, col, currentTeam);
    setPanels(newPanels);
    setHistory([...history, newPanels]);

    if (newPanels.flat().every((panel) => panel.color !== null)) {
      declareWinner(newPanels);
    }
  };

  const declareWinner = useCallback(
    (panels: Panel[][]) => {
      const colorCount: { [key: string]: number } = {};
      teamColors.forEach((color) => {
        colorCount[color] = panels
          .flat()
          .filter((panel) => panel.color === color).length;
      });

      const maxCount = Math.max(...Object.values(colorCount));
      const winningTeams = Object.keys(colorCount).filter(
        (color) => colorCount[color] === maxCount,
      );

      if (winningTeams.length > 1) {
        setWinners(winningTeams.map((color) => teamNames[color]).join(', '));
      } else {
        setWinners(teamNames[winningTeams[0]]);
      }
    },
    [teamColors, teamNames],
  );

  const handleReset = () => {
    setShowResetModal(true);
  };

  const confirmReset = () => {
    setShowResetModal(false);
    setPanels(initialPanels());
    setHistory([initialPanels()]);
    setWinners(null);
  };

  const cancelReset = () => {
    setShowResetModal(false);
  };

  const handleTeamNameChange = (color: string, name: string) => {
    setTeamNames((prevNames) => ({
      ...prevNames,
      [color]: name,
    }));
  };

  useEffect(() => {
    if (panels.flat().every((panel) => panel.color !== null)) {
      declareWinner(panels);
    }
  }, [panels, declareWinner]);

  return {
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
  };
};

export default useAttack25;
