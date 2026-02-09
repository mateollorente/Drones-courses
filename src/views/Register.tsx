import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../utils/db';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', dni: '' });
  const [error, setError] = useState('');

  const translations = {
    es: {
      title: 'Únete a la Academia',
      subtitle: 'Comienza tu viaje para convertirte en un piloto de drones certificado.',
      name: 'Nombre Completo',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      dni: 'DNI / Identificación',
      btn: 'Crear Cuenta',
      login: '¿Ya tienes cuenta?',
      loginLink: 'Inicia sesión aquí',
      disclaimer: 'Al registrarte, aceptas nuestros términos y condiciones de vuelo.',
      errorExists: 'El usuario ya existe (Email o DNI duplicado).'
    },
    en: {
      title: 'Join the Academy',
      subtitle: 'Start your journey to becoming a certified drone pilot.',
      name: 'Full Name',
      email: 'Email Address',
      password: 'Password',
      dni: 'ID / Passport Number',
      btn: 'Create Account',
      login: 'Already have an account?',
      loginLink: 'Log in here',
      disclaimer: 'By registering, you agree to our flight terms and conditions.',
      errorExists: 'User already exists (Duplicate Email or ID).'
    }
  };

  const t = translations[language];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = db.register(formData);

    if (result.success) {
      // Auto login after register
      login();
      navigate('/dashboard');
    } else {
      if (result.message === 'email_exists' || result.message === 'dni_exists') {
        setError(t.errorExists);
      } else {
        setError('Error desconocido');
      }
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
          src="https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=1600"
          alt="Drone Pilot"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-12 left-12 z-20 max-w-lg">
          <blockquote className="text-3xl font-bold text-white leading-tight">
            "La formación que recibí cambió mi carrera. Ahora opero inspecciones industriales a nivel internacional."
          </blockquote>
          <p className="mt-4 text-white font-bold">— Maria Rodriguez, Piloto Certificada</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2 pt-20">
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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-1">{t.name}</label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-[#393028] dark:bg-[#221910] dark:text-white"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-1">{t.dni}</label>
                <input
                  name="dni"
                  type="text"
                  value={formData.dni}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-[#393028] dark:bg-[#221910] dark:text-white"
                  placeholder="12345678A"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-1">{t.email}</label>
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
                <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-1">{t.password}</label>
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
            {t.login} <Link to="/login" className="font-bold text-primary hover:underline">{t.loginLink}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
