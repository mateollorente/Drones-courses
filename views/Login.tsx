
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Language } from '../App';
import { db } from '../utils/db';

interface LoginProps {
  onLogin: () => void;
  language: Language;
}

const Login: React.FC<LoginProps> = ({ onLogin, language }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const translations = {
    es: {
      title: 'Bienvenido de nuevo',
      subtitle: 'Ingresa tus credenciales para acceder a la plataforma.',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      btn: 'Iniciar Sesión',
      register: '¿No tienes cuenta?',
      registerLink: 'Regístrate aquí',
      error: 'Credenciales inválidas. Por favor intenta de nuevo.'
    },
    en: {
      title: 'Welcome Back',
      subtitle: 'Enter your credentials to access the platform.',
      email: 'Email Address',
      password: 'Password',
      btn: 'Login',
      register: 'No account?',
      registerLink: 'Register here',
      error: 'Invalid credentials. Please try again.'
    }
  };

  const t = translations[language];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = db.login(formData.email, formData.password);
    
    if (result.success) {
      onLogin();
      navigate('/dashboard');
    } else {
      setError(t.error);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background-light dark:bg-background-dark relative">
        
       {/* Logo / Home Button */}
       <div className="absolute top-6 left-6 z-50">
        <Link to="/" className="flex items-center gap-2 text-primary hover:text-white transition-colors">
          <span className="material-symbols-outlined text-3xl">flight_takeoff</span>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">AeroVision</span>
        </Link>
      </div>

      {/* Left Side - Image */}
      <div className="hidden w-1/2 lg:block relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10" />
        <img 
          src="https://images.unsplash.com/photo-1473960104312-30238805f884?auto=format&fit=crop&q=80&w=1600" 
          alt="Drone Controller" 
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-12 left-12 z-20 max-w-lg">
          <h3 className="text-3xl font-bold text-white leading-tight">
            Panel de Control Profesional
          </h3>
          <p className="mt-4 text-white font-medium opacity-90">Gestiona tus horas de vuelo y accede al simulador desde cualquier lugar.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white">{t.title}</h1>
            <p className="mt-2 text-slate-600 dark:text-gray-400">{t.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm font-bold text-center">
                    {error}
                </div>
            )}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">{t.email}</label>
                <input 
                  name="email"
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-[#393028] dark:bg-[#221910] dark:text-white"
                  placeholder="pilot@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">{t.password}</label>
                <input 
                  name="password"
                  type="password" 
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-[#393028] dark:bg-[#221910] dark:text-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full rounded-xl bg-primary py-4 text-lg font-bold text-[#181411] shadow-lg transition-transform hover:scale-[1.02] hover:bg-[#ff9529]"
            >
              {t.btn}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            {t.register} <Link to="/register" className="font-bold text-primary hover:underline">{t.registerLink}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
