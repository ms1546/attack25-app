import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Panel from '../../components/Panel';

test('renders panel with correct number and color', () => {
  const panel = { number: 1, color: '#555' };
  render(<Panel panel={panel} canFlip={true} handleClick={() => {}} />);

  const panelElement = screen.getByText('1');
  expect(panelElement).toBeInTheDocument();
  expect(panelElement).toHaveStyle('background-color: #555');
});

test('applies flipped and can-flip classes', () => {
  const panel = { number: 1, color: '#555' };
  render(<Panel panel={panel} canFlip={true} handleClick={() => {}} />);

  const panelElement = screen.getByText('1').closest('div');
  expect(panelElement).toHaveClass('flipped');
  expect(panelElement).toHaveClass('can-flip');
});

test('calls handleClick on panel click', () => {
  const handleClick = jest.fn();
  const panel = { number: 1, color: '#555' };
  render(<Panel panel={panel} canFlip={true} handleClick={handleClick} />);

  screen.getByText('1').click();
  expect(handleClick).toHaveBeenCalled();
});
