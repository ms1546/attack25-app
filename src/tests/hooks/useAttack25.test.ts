import { renderHook, act } from '@testing-library/react-hooks';
import useAttack25 from '../../hooks/useAttack25';

test('initializes panels correctly', () => {
  const { result } = renderHook(() => useAttack25());
  expect(result.current.panels.length).toBe(4);
  expect(result.current.panels[0].length).toBe(4
  );
  expect(result.current.panels[0][0].number).toBe(1);
});

test('handles panel click', () => {
  const { result } = renderHook(() => useAttack25());
  act(() => {
    result.current.handlePanelClick(0, 0);
  });
  expect(result.current.panels[0][0].color).toBe('red');
});

test('resets the game', () => {
  const { result } = renderHook(() => useAttack25());
  act(() => {
    result.current.handlePanelClick(0, 0);
    result.current.confirmReset();
  });
  expect(result.current.panels[0][0].color).toBeNull();
});
