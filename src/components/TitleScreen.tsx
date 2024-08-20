import { useNavigate } from 'react-router-dom';

const TitleScreen = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/game');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-4xl font-bold mb-8">Attack 25</h1>
      <button
        className="px-6 py-4 bg-green-500 text-white text-lg rounded hover:bg-green-600"
        onClick={handleStartClick}
      >
        進む
      </button>
    </div>
  );
};

export default TitleScreen;
