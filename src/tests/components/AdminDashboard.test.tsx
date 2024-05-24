import { render, screen } from '@testing-library/react';
import AdminDashboard from '../../components/AdminDashboard';

describe('AdminDashboard', () => {
  beforeAll(() => {
    global.fetch = jest.fn();
  });

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('fetches and displays questions', async () => {
    const mockResponse = [
      { id: 1, question: 'Sample Question 1', answer: 'Sample Answer 1' },
      { id: 2, question: 'Sample Question 2', answer: 'Sample Answer 2' },
    ];
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    render(<AdminDashboard />);

    expect(
      await screen.findByText('Sample Question 1 - Sample Answer 1'),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Sample Question 2 - Sample Answer 2'),
    ).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('/api/questions', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  });
});
