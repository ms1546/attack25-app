import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Attack 25 title', () => {
  render(<App />);
  expect(screen.getByText('Attack 25')).toBeInTheDocument();
});
