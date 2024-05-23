import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AdminDashboard from '../../components/AdminDashboard';

jest.mock('../../components/QuestionForm', () => ({
  __esModule: true,
  default: function DummyQuestionForm(props: any) {
    return <div>QuestionForm Component</div>;
  },
}));

jest.mock('../../components/QuestionList', () => ({
  __esModule: true,
  default: function DummyQuestionList(props: any) {
    return <div>QuestionList Component</div>;
  },
}));

describe('AdminDashboard', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('renders AdminDashboard component', async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));

    render(<AdminDashboard />);

    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    expect(screen.getByText('QuestionForm Component')).toBeInTheDocument();
    expect(screen.getByText('QuestionList Component')).toBeInTheDocument();
  });

  test('fetches and displays questions', async () => {
    const questions = [
      { id: 1, question: 'Sample Question 1', answer: 'Sample Answer 1' },
      { id: 2, question: 'Sample Question 2', answer: 'Sample Answer 2' },
    ];
    fetchMock.mockResponseOnce(JSON.stringify(questions));

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Sample Question 1 - Sample Answer 1')).toBeInTheDocument();
      expect(screen.getByText('Sample Question 2 - Sample Answer 2')).toBeInTheDocument();
    });
  });
});
