
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Language } from '../App';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  scrollToCourses?: (e: React.MouseEvent) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  isLoggedIn, 
  onLogin, 
  onLogout, 
  language, 
  onLanguageChange,
  scrollToCourses 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isLanding = location.pathname === '/';

  const translations = {
    es: {
      courses: 'Cursos',
      regulatory: 'Normativa',
      dashboard: 'Mi Panel',
      instructor: 'Instructor',
      simulator: 'Simulador',
      portal: 'Portal Piloto',
      logout: 'Salir',
      login: 'Acceder',
      register: 'Registrarse'
    },
    en: {
      courses: 'Courses',
      regulatory: 'Regulatory',
      dashboard: 'Dashboard',
      instructor: 'Instructor',
      simulator: 'Simulator',
      portal: 'Pilot Portal',
      logout: 'Logout',
      login: 'Login',
      register: 'Register'
    }
  };

  const t = translations[language];

  // Common links available to everyone or specific contexts
  const renderLinks = () => (
    <>
      {isLanding && scrollToCourses ? (
        <a 
          href="#courses" 
          onClick={(e) => { scrollToCourses(e); setIsMobileMenuOpen(false); }}
          className="text-gray-300 hover:text-primary text-sm font-medium transition-colors cursor-pointer"
        >
          {t.courses}
        </a>
      ) : (
        <Link 
          to="/course-details"
          onClick={() => setIsMobileMenuOpen(false)}
          className={`text-sm font-medium transition-colors ${location.pathname === '/course-details' ? 'text-primary' : 'text-gray-300 hover:text-primary'}`}
        >
          {t.courses}
        </Link>
      )}

      <Link 
        to="/compliance" 
        onClick={() => setIsMobileMenuOpen(false)}
        className={`text-sm font-medium transition-colors ${location.pathname === '/compliance' ? 'text-primary' : 'text-gray-300 hover:text-primary'}`}
      >
        {t.regulatory}
      </Link>

      {isLoggedIn && (
        <>
          <Link 
            to="/dashboard" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-primary' : 'text-gray-300 hover:text-primary'}`}
          >
            {t.dashboard}
          </Link>
          <Link 
            to="/instructor" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`text-sm font-medium transition-colors ${location.pathname === '/instructor' ? 'text-primary' : 'text-gray-300 hover:text-primary'}`}
          >
            {t.instructor}
          </Link>
           <Link 
            to="/simulator" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`text-sm font-medium transition-colors ${location.pathname === '/simulator' ? 'text-primary' : 'text-gray-300 hover:text-primary'}`}
          >
            {t.simulator}
          </Link>
        </>
      )}
    </>
  );

  const handleAuthAction = (action: 'login' | 'logout' | 'register' | 'portal') => {
    setIsMobileMenuOpen(false);
    if (action === 'logout') onLogout();
    if (action === 'login') navigate('/login');
    if (action === 'register') navigate('/register');
    if (action === 'portal') {
        if(!isLoggedIn) {
             const msg = language === 'es' 
            ? "Esta área requiere una cuenta de piloto. Por favor, accede para continuar."
            : "This area requires a pilot account. Please login to continue.";
            alert(msg);
            navigate('/login');
        } else {
            navigate('/dashboard');
        }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#393028] bg-background-dark/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-white z-50">
          <div className="flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-3xl">flight_takeoff</span>
          </div>
          <h2 className="text-xl font-bold leading-tight tracking-wide">AeroVision</h2>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {renderLinks()}
          
          <div className="flex items-center gap-4 border-l border-[#393028] pl-6">
            {/* Language Switcher */}
            <div className="flex gap-1 bg-[#12100e] p-1 rounded-lg border border-[#393028]">
                <button 
                  onClick={() => onLanguageChange('es')} 
                  className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${language === 'es' ? 'bg-primary text-black shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >ES</button>
                <button 
                  onClick={() => onLanguageChange('en')} 
                  className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${language === 'en' ? 'bg-primary text-black shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >EN</button>
            </div>

            <div className="flex gap-3">
              {isLoggedIn ? (
                <button 
                  onClick={() => handleAuthAction('logout')}
                  className="flex items-center justify-center rounded-lg h-9 px-4 border border-[#393028] bg-transparent text-white text-sm font-bold hover:bg-[#393028] transition-colors"
                >
                  {t.logout}
                </button>
              ) : (
                <>
                    <button 
                        onClick={() => handleAuthAction('login')}
                        className="flex items-center justify-center rounded-lg h-9 px-4 border border-[#393028] bg-transparent text-white text-sm font-bold hover:bg-[#393028] transition-colors"
                    >
                        {t.login}
                    </button>
                    <button 
                        onClick={() => handleAuthAction('register')}
                        className="flex items-center justify-center rounded-lg h-9 px-4 bg-primary text-[#181411] text-sm font-bold shadow-[0_0_15px_rgba(240,133,25,0.3)] hover:bg-[#ff9529] transition-all"
                    >
                        {t.register}
                    </button>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-white hover:text-primary z-50"
        >
          <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-background-dark/95 backdrop-blur-xl z-40 md:hidden flex flex-col p-6 space-y-6 animate-in fade-in slide-in-from-top-5">
            <div className="flex flex-col gap-6 text-lg">
                {renderLinks()}
            </div>
            <div className="h-px bg-[#393028] w-full" />
            
            <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => onLanguageChange('es')} 
                  className={`flex-1 py-2 font-bold rounded border ${language === 'es' ? 'bg-primary border-primary text-black' : 'border-[#393028] text-gray-400'}`}
                >Español</button>
                <button 
                  onClick={() => onLanguageChange('en')} 
                  className={`flex-1 py-2 font-bold rounded border ${language === 'en' ? 'bg-primary border-primary text-black' : 'border-[#393028] text-gray-400'}`}
                >English</button>
            </div>

            <div className="flex flex-col gap-3 mt-auto">
              {isLoggedIn ? (
                <button 
                  onClick={() => handleAuthAction('logout')}
                  className="w-full flex items-center justify-center rounded-xl h-12 border border-[#393028] bg-[#221910] text-white font-bold"
                >
                  {t.logout}
                </button>
              ) : (
                <>
                    <button 
                        onClick={() => handleAuthAction('login')}
                        className="w-full flex items-center justify-center rounded-xl h-12 border border-[#393028] bg-[#221910] text-white font-bold"
                    >
                        {t.login}
                    </button>
                    <button 
                        onClick={() => handleAuthAction('register')}
                        className="w-full flex items-center justify-center rounded-xl h-12 bg-primary text-[#181411] font-bold shadow-lg"
                    >
                        {t.register}
                    </button>
                </>
              )}
            </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
