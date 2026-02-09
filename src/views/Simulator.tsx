import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Simulator: React.FC = () => {
   const { language } = useLanguage();

   const translations = {
      es: {
         live: 'SEÑAL EN VIVO',
         objective: 'Objetivo Actual',
         lesson: 'Lección 1: Vuelo Estacionario',
         exit: 'SALIR DEL SIMULADOR'
      },
      en: {
         live: 'LIVE FEED',
         objective: 'Current Objective',
         lesson: 'Lesson 1: Hovering Basics',
         exit: 'EXIT SIMULATOR'
      }
   };
   const t = translations[language];

   return (
      <div className="relative h-screen w-screen overflow-hidden bg-gray-900 text-white font-display">
         <div className="absolute inset-0 bg-gray-800"></div>
         <div className="relative z-10 h-full flex flex-col justify-between p-6">
            <header className="flex justify-between items-start">
               <div className="space-y-4">
                  <span className="bg-primary px-2 py-0.5 rounded text-[10px] font-bold text-black uppercase">{t.live}</span>
                  <div className="bg-black/40 p-4 rounded-xl border border-white/10">
                     <div className="text-[10px] text-primary uppercase font-bold mb-1">{t.objective}</div>
                     <div className="text-lg font-bold">{t.lesson}</div>
                  </div>
               </div>
            </header>
            <footer className="flex justify-end p-6">
               <Link to="/dashboard" className="bg-primary text-black font-black py-4 px-10 rounded-xl transition-all">
                  {t.exit}
               </Link>
            </footer>
         </div>
      </div>
   );
};

export default Simulator;
