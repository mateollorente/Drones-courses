import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor"
            element={
              <ProtectedRoute>
                <InstructorPanel />
              </ProtectedRoute>
            }
          />
          <Route path="/course-details" element={<CourseDetails />} />
          <Route
            path="/learn"
            element={
              <ProtectedRoute>
                <CourseLearning />
              </ProtectedRoute>
            }
          />
          <Route path="/compliance" element={<ComplianceGuide />} />
        </Route>

        <Route
          path="/simulator"
          element={
            <ProtectedRoute>
              <Simulator />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
