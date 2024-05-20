import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TitleScreen from '../../components/TitleScreen';
import '@testing-library/jest-dom';

test('renders Attack 25 title and start button', () => {
  render(
    <MemoryRouter>
      <TitleScreen />
    </MemoryRouter>,
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
    </MemoryRouter>,
  );

  fireEvent.click(screen.getByText('進む'));
  expect(await screen.findByText('Game Page')).toBeInTheDocument();
});
