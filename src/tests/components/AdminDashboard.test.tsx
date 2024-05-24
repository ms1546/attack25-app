import { render, screen, fireEvent, act } from '@testing-library/react';
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

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Question:'), { target: { value: 'New Question' } });
      fireEvent.change(screen.getByLabelText('Answer:'), { target: { value: 'New Answer' } });
      fireEvent.click(screen.getByRole('button', { name: /Add Question/i }));
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('/api/questions', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expect.stringContaining('"question":"New Question"'),
      body: expect.stringContaining('"answer":"New Answer"'),
    }));

    await act(async () => {
    });

    expect(addQuestionMock).toHaveBeenCalledTimes(1);
    expect(addQuestionMock).toHaveBeenCalledWith(mockResponse);
  });
});
