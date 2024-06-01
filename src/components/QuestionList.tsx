import React from 'react';

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
  return (
    <div className="mb-8">
      <h2 className="text-center text-xl font-semibold text-gray-800 mb-4">Questions</h2>
      <ul className="list-none p-0">
        {questions.map((question) => (
          <li key={question.id} className="flex justify-between items-center p-2 border-b border-gray-300">
            <span>{question.question}</span>
            <button
              onClick={() => deleteQuestion(question.id)}
              className="p-1 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionList;
