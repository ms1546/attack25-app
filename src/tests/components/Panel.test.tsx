import { render, screen, fireEvent } from '@testing-library/react';
import Panel from '../../components/Panel';

test('renders panel with number and default background', () => {
  const panel = { color: null, number: 1 };
  render(<Panel panel={panel} canFlip={true} handleClick={() => {}} />);

  expect(screen.getByText('1')).toBeInTheDocument();
  expect(screen.getByText('1').closest('div')).toHaveStyle('background-color: #555');
});

test('applies flipped and can-flip classes', () => {
  const panel = { color: 'red', number: 1 };
  render(<Panel panel={panel} canFlip={true} handleClick={() => {}} />);

  const panelElement = screen.getByText('1').closest('div');
  expect(panelElement).toHaveClass('flipped');
  expect(panelElement).toHaveClass('can-flip');
});

test('calls handleClick on panel click', () => {
  const panel = { color: null, number: 1 };
  const handleClick = jest.fn();
  render(<Panel panel={panel} canFlip={true} handleClick={handleClick} />);

  fireEvent.click(screen.getByText('1'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
