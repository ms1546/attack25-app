import { render, screen, fireEvent } from '@testing-library/react';
import ResetModal from '../../components/ResetModal';

test('renders reset modal with buttons', () => {
  const confirmReset = jest.fn();
  const cancelReset = jest.fn();
  render(<ResetModal confirmReset={confirmReset} cancelReset={cancelReset} />);

  expect(screen.getByText('Resetしますか？')).toBeInTheDocument();
  expect(screen.getByText('はい')).toBeInTheDocument();
  expect(screen.getByText('いいえ')).toBeInTheDocument();
});

test('calls confirmReset on yes button click', () => {
  const confirmReset = jest.fn();
  const cancelReset = jest.fn();
  render(<ResetModal confirmReset={confirmReset} cancelReset={cancelReset} />);

  fireEvent.click(screen.getByText('はい'));
  expect(confirmReset).toHaveBeenCalledTimes(1);
});

test('calls cancelReset on no button click', () => {
  const confirmReset = jest.fn();
  const cancelReset = jest.fn();
  render(<ResetModal confirmReset={confirmReset} cancelReset={cancelReset} />);

  fireEvent.click(screen.getByText('いいえ'));
  expect(cancelReset).toHaveBeenCalledTimes(1);
});
