
import React, { useState } from 'react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './views/LandingPage';
import Dashboard from './views/Dashboard';
import InstructorPanel from './views/InstructorPanel';
import CourseDetails from './views/CourseDetails';
import ComplianceGuide from './views/ComplianceGuide';
import Simulator from './views/Simulator';
import Register from './views/Register';
import Login from './views/Login';
import CourseLearning from './views/CourseLearning';

export type Language = 'es' | 'en';

const ProtectedRoute = ({ children, isLoggedIn }: { children?: React.ReactNode, isLoggedIn: boolean }) => {
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('es');

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);
  const toggleLanguage = (lang: Language) => setLanguage(lang);

  return (
    <MemoryRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <LandingPage 
              isLoggedIn={isLoggedIn} 
              onLogin={handleLogin} 
              onLogout={handleLogout} 
              language={language}
              onLanguageChange={toggleLanguage}
            />
          } 
        />

        <Route 
          path="/register" 
          element={
            <Register 
              onLogin={handleLogin} 
              language={language} 
            />
          } 
        />

        <Route 
          path="/login" 
          element={
            <Login 
              onLogin={handleLogin} 
              language={language} 
            />
          } 
        />
        
        <Route 
          element={
            <Layout 
              isLoggedIn={isLoggedIn}
              onLogout={handleLogout} 
              onLogin={handleLogin}
              language={language} 
              onLanguageChange={toggleLanguage} 
            />
          }
        >
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Dashboard language={language} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/instructor" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <InstructorPanel language={language} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/course-details" 
            element={<CourseDetails language={language} />} 
          />
          <Route 
            path="/learn" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <CourseLearning language={language} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/compliance" 
            element={<ComplianceGuide language={language} />} 
          />
        </Route>

        <Route 
          path="/simulator" 
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Simulator language={language} />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MemoryRouter>
  );
};

export default App;
