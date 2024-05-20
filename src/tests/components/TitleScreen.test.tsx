import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import TitleScreen from '../../components/TitleScreen';
import { waitFor } from '@testing-library/react';

test('renders title and start button', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <TitleScreen />
    </MemoryRouter>
  );

  expect(screen.getByText('Attack 25')).toBeInTheDocument();
  expect(screen.getByText('進む')).toBeInTheDocument();
});

test('navigates to game on start button click', async () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<TitleScreen />} />
        <Route path="/game" element={<div>Game Page</div>} />
      </Routes>
    </MemoryRouter>
  );

  userEvent.click(screen.getByText('進む'));

  screen.debug();

  await waitFor(() => expect(screen.getByText('Game Page')).toBeInTheDocument());
});
