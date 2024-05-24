import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuestionForm from '../../components/QuestionForm';

describe('QuestionForm', () => {
  beforeAll(() => {
    global.fetch = jest.fn();
  });

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders QuestionForm component', () => {
    const addQuestionMock = jest.fn();
    render(<QuestionForm addQuestion={addQuestionMock} />);

    expect(screen.getByLabelText('Question:')).toBeInTheDocument();
    expect(screen.getByLabelText('Answer:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Question/i })).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const addQuestionMock = jest.fn();
    const mockResponse = { id: 1, question: 'New Question', answer: 'New Answer' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    render(<QuestionForm addQuestion={addQuestionMock} />);

    fireEvent.change(screen.getByLabelText('Question:'), { target: { value: 'New Question' } });
    fireEvent.change(screen.getByLabelText('Answer:'), { target: { value: 'New Answer' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Question/i }));

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expect.any(String), // ここでidを無視
    });

    await waitFor(() => {
      expect(addQuestionMock).toHaveBeenCalledWith(mockResponse);
    });
  });
});
