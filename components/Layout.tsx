
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Language } from '../App';
import Navbar from './Navbar';

interface LayoutProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onLogin: () => void; // Added onLogin to satisfy Navbar props
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const Layout: React.FC<LayoutProps> = ({ isLoggedIn, onLogout, onLogin, language, onLanguageChange }) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      {/* Universal Top Navigation */}
      <Navbar 
        isLoggedIn={isLoggedIn}
        onLogin={onLogin}
        onLogout={onLogout}
        language={language}
        onLanguageChange={onLanguageChange}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col relative">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
