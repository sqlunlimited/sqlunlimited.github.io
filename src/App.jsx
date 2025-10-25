import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import SQLPracticePlatform from './pages/SQLPracticePlatform';
import QuestionGenerator from './pages/QuestionGenerator';

// Wrapper component to pass navigate function
const AppContent = () => {
  const navigate = useNavigate();

  const handleNavigate = (page) => {
    switch(page) {
      case 'landing':
        navigate('/');
        break;
      case 'about':
        navigate('/about');
        break;
      case 'practice':
        navigate('/practice');
        break;
      case 'generator':  // NEW
        navigate('/generator');
        break;
      default:
        navigate('/');
    }
    window.scrollTo(0, 0);
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage onNavigate={handleNavigate} />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/about" element={<AboutPage onNavigate={handleNavigate} />} />
      <Route path="/practice" element={<SQLPracticePlatform onNavigate={handleNavigate} />} />
      <Route path="/generator" element={<QuestionGenerator onNavigate={handleNavigate} />} />

      {/* NEW: Route for individual questions */}
      <Route path="/practice/:questionId" element={<SQLPracticePlatform onNavigate={handleNavigate} />} />
      <Route path="/sql-practice-platform" element={<Navigate to="/practice" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;

