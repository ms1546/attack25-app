import React, { useState } from 'react';

interface QuestionFormProps {
  addQuestion: (question: { id: number; question: string; answer: string }) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ addQuestion }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newQuestion = {
      id: Math.floor(Math.random() * 1000),
      question,
      answer,
    };
    addQuestion(newQuestion);
    setQuestion('');
    setAnswer('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <label className="block mb-2 text-sm font-medium text-gray-700">Question</label>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        required
        className="block w-full p-2 mb-4 border border-gray-300 rounded-lg"
      />
      <label className="block mb-2 text-sm font-medium text-gray-700">Answer</label>
      <input
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        required
        className="block w-full p-2 mb-4 border border-gray-300 rounded-lg"
      />
      <button
        type="submit"
        className="w-full p-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
      >
        Add Question
      </button>
    </form>
  );
};

export default QuestionForm;
