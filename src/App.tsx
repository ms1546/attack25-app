import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TitleScreen from './components/TitleScreen';
import Attack25Board from './components/Attack25Board';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TitleScreen />} />
        <Route path="/game" element={<Attack25Board />} />
      </Routes>
    </Router>
  );
};

export default App;
