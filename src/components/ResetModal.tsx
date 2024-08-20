import React from 'react';

interface ResetModalProps {
  confirmReset: () => void;
  cancelReset: () => void;
}

const ResetModal: React.FC<ResetModalProps> = ({ confirmReset, cancelReset }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-gray-900 text-white p-8 rounded-lg text-center shadow-lg">
        <h1 className="text-2xl mb-4">Resetしますか？</h1>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={confirmReset}
          >
            はい
          </button>
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={cancelReset}
          >
            いいえ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetModal;
