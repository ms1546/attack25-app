import React, { useState, useEffect } from 'react';
import QuestionForm from './QuestionForm';
import QuestionList from './QuestionList';

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
    <div className="p-8 font-sans">
      <div className="max-w-2xl mx-auto bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
        <h1 className="text-center text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
        <QuestionForm addQuestion={addQuestion} />
        <QuestionList questions={questions} deleteQuestion={deleteQuestion} />
      </div>
    </div>
  );
};

export default AdminDashboard;
