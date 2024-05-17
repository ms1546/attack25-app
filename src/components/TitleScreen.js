import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style/TitleScreen.css';

function TitleScreen() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/game');
  };

  return (
    <div className="title-screen">
      <h1 className="title">Attack 25</h1>
      <button className="start-button" onClick={handleStartClick}>進む</button>
    </div>
  );
}

export default TitleScreen;
