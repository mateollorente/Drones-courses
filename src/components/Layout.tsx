import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      {/* Universal Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col relative">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
