import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';
import ChatWidget from './ChatWidget';
import { useAuth } from '../context/AuthContext';

import { db } from '../utils/db'; // Import db

// Helper component for badge
const UnreadBadge = () => {
  const { user } = useAuth();
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!user) return;
    const check = () => {
      const msgs = db.getMessages(user.email, 'admin@aerovision.com');
      const unread = msgs.filter(m => m.fromEmail === 'admin@aerovision.com' && !m.read).length;
      setCount(unread);
    };
    check();
    const interval = setInterval(check, 2000);
    return () => clearInterval(interval);
  }, [user]);

  if (count === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white dark:border-[#1e1a16]">
      {count > 9 ? '9+' : count}
    </span>
  );
};

const Layout: React.FC = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      {/* Universal Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col relative">
        <Outlet />
      </main>

      {/* Chat Widget / Button */}
      {isLoggedIn && (
        <>
          {/* Admin Floating Button -> Goes to /admin/messages */}
          {isAdmin ? (
            <Link
              to="/admin/messages"
              className="fixed bottom-6 right-6 h-14 w-14 bg-primary text-black rounded-full shadow-lg flex items-center justify-center hover:bg-[#ff9529] transition-transform hover:scale-105 z-50"
            >
              <span className="material-symbols-outlined text-2xl">chat</span>
            </Link>
          ) : (
            /* Student Floating Button -> Opens Widget */
            <>
              {!showChat && (
                <button
                  onClick={() => setShowChat(true)}
                  className="fixed bottom-6 right-6 h-14 w-14 bg-primary text-black rounded-full shadow-lg flex items-center justify-center hover:bg-[#ff9529] transition-transform hover:scale-105 z-50 pointer-events-auto"
                >
                  <span className="material-symbols-outlined text-2xl">chat</span>
                  {/* Unread Badge */}
                  <UnreadBadge />
                </button>
              )}
              {showChat && <ChatWidget onClose={() => setShowChat(false)} />}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Layout;
