import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TitleScreen from './components/TitleScreen';
import Attack25Board from './components/Attack25Board';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TitleScreen />} />
        <Route path="/game" element={<Attack25Board />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
