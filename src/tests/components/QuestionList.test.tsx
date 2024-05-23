import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import QuestionList from '../../components/QuestionList';

describe('QuestionList', () => {
  const deleteQuestionMock = jest.fn();
  const questions = [
    { id: 1, question: 'Sample Question 1', answer: 'Sample Answer 1' },
    { id: 2, question: 'Sample Question 2', answer: 'Sample Answer 2' },
  ];

  test('renders QuestionList component', () => {
    render(<QuestionList questions={questions} deleteQuestion={deleteQuestionMock} />);

    expect(screen.getByText('Sample Question 1 - Sample Answer 1')).toBeInTheDocument();
    expect(screen.getByText('Sample Question 2 - Sample Answer 2')).toBeInTheDocument();
  });

  test('deletes a question', () => {
    render(<QuestionList questions={questions} deleteQuestion={deleteQuestionMock} />);

    fireEvent.click(screen.getAllByRole('button', { name: /Delete/i })[0]);

    expect(deleteQuestionMock).toHaveBeenCalledWith(1);
  });
});
