import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import QuestionForm from '../../components/QuestionForm';

describe('QuestionForm', () => {
  const addQuestionMock = jest.fn();

  test('renders QuestionForm component', () => {
    render(<QuestionForm addQuestion={addQuestionMock} />);

    expect(screen.getByLabelText('Question:')).toBeInTheDocument();
    expect(screen.getByLabelText('Answer:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Question/i })).toBeInTheDocument();
  });

  test('submits form with valid data', () => {
    render(<QuestionForm addQuestion={addQuestionMock} />);

    fireEvent.change(screen.getByLabelText('Question:'), { target: { value: 'New Question' } });
    fireEvent.change(screen.getByLabelText('Answer:'), { target: { value: 'New Answer' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Question/i }));

    expect(addQuestionMock).toHaveBeenCalledWith({ id: expect.any(Number), question: 'New Question', answer: 'New Answer' });
  });
});
