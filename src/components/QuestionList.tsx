import React from 'react';
import './style/AdminDashboard.css';

interface Question {
  id: number;
  question: string;
  answer: string;
}

interface QuestionListProps {
  questions: Question[];
  deleteQuestion: (id: number) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, deleteQuestion }) => {
  const handleDelete = (id: number) => {
    fetch(`/api/questions/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 200) {
          deleteQuestion(id);
        } else {
          console.error('Failed to delete question');
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <div className="question-list">
      <h2>Question List</h2>
      <ul>
        {questions.map((question) => (
          <li key={question.id}>
            {question.question} - {question.answer}
            <button onClick={() => handleDelete(question.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionList;
