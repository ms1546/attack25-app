import React, { useState, useEffect } from 'react';
import QuestionForm from './QuestionForm';
import QuestionList from './QuestionList';
import './style/AdminDashboard.css';

interface Question {
  id: number;
  question: string;
  answer: string;
}

const AdminDashboard: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetch('/api/questions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => setQuestions(data))
      .catch((error) => console.error('Error:', error));
  }, []);

  const addQuestion = (newQuestion: Question) => {
    setQuestions([...questions, newQuestion]);
  };

  const deleteQuestion = (id: number) => {
    setQuestions(questions.filter((question) => question.id !== id));
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <QuestionForm addQuestion={addQuestion} />
      <QuestionList questions={questions} deleteQuestion={deleteQuestion} />
    </div>
  );
};

export default AdminDashboard;
