import React, { useState } from 'react';
import './style/AdminDashboard.css';

interface QuestionFormProps {
  addQuestion: (question: Question) => void;
}

interface Question {
  id: number;
  question: string;
  answer: string;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ addQuestion }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newQuestion = { id: Date.now(), question, answer };

    fetch('/api/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newQuestion),
    })
      .then((response) => response.json())
      .then((data) => {
        addQuestion(data);
        setQuestion('');
        setAnswer('');
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <form className="question-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="question">Question:</label>
        <input
          id="question"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="answer">Answer:</label>
        <input
          id="answer"
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
      </div>
      <button type="submit">Add Question</button>
    </form>
  );
};

export default QuestionForm;
