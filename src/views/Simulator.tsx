import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Simulator: React.FC = () => {
   const { language } = useLanguage();

   const translations = {
      es: {
         title: 'Simulador de Vuelo',
         message: 'Esta función no está disponible por el momento.',
         sub: 'Estamos trabajando en una experiencia de simulación integrada. Por favor, vuelve más tarde.',
         back: 'Volver al Dashboard'
      },
      en: {
         title: 'Flight Simulator',
         message: 'This feature is currently unavailable.',
         sub: 'We are working on an integrated simulation experience. Please check back later.',
         back: 'Back to Dashboard'
      }
   };
   const t = translations[language];

   return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
         {/* Background Effect */}
         <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
         </div>

         <div className="text-center max-w-md relative z-10 p-8 border border-[#393028] bg-[#181411]/80 backdrop-blur rounded-2xl shadow-2xl">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-800 border border-gray-700">
               <span className="material-symbols-outlined text-4xl text-gray-500">construction</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{t.title}</h1>
            <h2 className="text-lg text-primary font-bold mb-4">{t.message}</h2>
            <p className="text-gray-400 mb-8">{t.sub}</p>

            <Link to="/dashboard" className="inline-flex items-center gap-2 bg-primary text-black font-bold py-3 px-6 rounded-xl hover:bg-[#ff9529] transition-colors">
               <span className="material-symbols-outlined text-sm">arrow_back</span>
               {t.back}
            </Link>
         </div>
      </div>
   );
};

export default Simulator;
