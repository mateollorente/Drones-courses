import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const CourseDetails: React.FC = () => {
  const { language } = useLanguage();

  const translations = {
    es: {
      title: 'Certificación Profesional Piloto VANT',
      sub: 'Domina las operaciones comerciales y normativas en 6 semanas.',
      start: 'Comenzar Curso',
      syllabus: 'Descargar Temario'
    },
    en: {
      title: 'Professional VANT Pilot Certification',
      sub: 'Master commercial operations and regulations in 6 weeks.',
      start: 'Start Course',
      syllabus: 'Download Syllabus'
    }
  };
  const t = translations[language];

  return (
    <div className="mx-auto max-w-5xl p-8 space-y-16">
      <section className="space-y-6">
        <h1 className="text-5xl font-bold leading-tight dark:text-white">{t.title}</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl font-light">{t.sub}</p>
        <div className="flex gap-4">
          <Link
            to="/learn"
            className="bg-primary hover:bg-orange-600 text-[#181411] font-bold py-3 px-8 rounded-lg text-lg transition-all shadow-lg inline-flex items-center gap-2"
          >
            {t.start}
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <button className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark py-3 px-6 rounded-lg text-lg font-bold flex items-center gap-2 dark:text-white hover:bg-gray-50 dark:hover:bg-[#322a24] transition-colors">
            <span className="material-symbols-outlined">download</span> {t.syllabus}
          </button>
        </div>
      </section>
      <div className="aspect-video rounded-2xl overflow-hidden border border-border-dark bg-gray-800 relative group">
        <img src="https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover opacity-80" alt="Course Cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <Link to="/learn" className="h-20 w-20 bg-white/20 backdrop-blur-md border border-white/50 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-4xl">play_arrow</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
