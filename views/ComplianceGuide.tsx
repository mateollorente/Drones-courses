
import React from 'react';
import { Link } from 'react-router-dom';
import { Language } from '../App';

interface ComplianceGuideProps {
  language: Language;
}

const ComplianceGuide: React.FC<ComplianceGuideProps> = ({ language }) => {
  const translations = {
    es: {
      title: 'Master the Skies Legally',
      sub: 'Guía de cumplimiento paso a paso para navegar las regulaciones de drones.',
      back: 'Volver al Inicio',
      official: 'Guía Oficial de Cumplimiento',
      stepTitle: 'Tu Camino a la Certificación',
      step1: 'Registro SISANT',
      step1Tag: 'Obligatorio > 250g',
      step2: 'Acceso SARPAS',
      step2Tag: 'Autorización',
      step3: 'Seguro RETA',
      step3Tag: 'Responsabilidad Civil',
      download: 'Descargar Resumen',
      cta: '¿Necesitas certificación?',
      ctaLink: 'Ver temario'
    },
    en: {
      title: 'Master the Skies Legally',
      sub: 'Step-by-step compliance guide to navigate drone regulations.',
      back: 'Back to Home',
      official: 'Official Compliance Guide',
      stepTitle: 'Your Path to Certification',
      step1: 'SISANT Registration',
      step1Tag: 'Mandatory > 250g',
      step2: 'SARPAS Access',
      step2Tag: 'Authorization',
      step3: 'RETA Insurance',
      step3Tag: 'Liability',
      download: 'Download Cheat Sheet',
      cta: 'Need certification?',
      ctaLink: 'View curriculum'
    }
  };

  const t = translations[language];

  return (
    <div className="flex-1 pb-20 relative">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-20">
        <Link to="/" className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all font-bold text-sm">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          {t.back}
        </Link>
      </div>

      {/* Hero */}
      <div className="relative py-24 px-8 border-b border-border-dark bg-black">
        <img src="https://picsum.photos/seed/reg/1600/600" className="absolute inset-0 w-full h-full object-cover opacity-30" alt="Guide" />
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-base">verified</span>
            {t.official}
          </div>
          <h1 className="text-5xl font-black text-white leading-tight">{t.title}</h1>
          <p className="text-lg text-slate-300 font-light leading-relaxed">{t.sub}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-16 grid lg:grid-cols-[1fr_340px] gap-12">
        <div className="space-y-12">
          <h2 className="text-3xl font-bold dark:text-white">{t.stepTitle}</h2>
          
          <div className="space-y-8 relative">
            <div className="absolute left-[27px] top-4 bottom-4 w-px bg-border-dark" />
            
            {[
              { id: '01', title: t.step1, tag: t.step1Tag, icon: 'app_registration', desc: 'Sistema para el registro de aeronaves no tripuladas.' },
              { id: '02', title: t.step2, tag: t.step2Tag, icon: 'flight_takeoff', desc: 'Utilizado para solicitar acceso al espacio aéreo.' },
              { id: '03', title: t.step3, tag: t.step3Tag, icon: 'security', desc: 'Seguro obligatorio de responsabilidad civil frente a terceros.' }
            ].map(step => (
              <div key={step.id} className="relative flex gap-8 group">
                <div className="relative z-10 shrink-0">
                  <div className="h-14 w-14 rounded-full bg-surface-dark border border-primary flex items-center justify-center shadow-[0_0_15px_rgba(240,133,25,0.2)]">
                    <span className="material-symbols-outlined text-primary text-2xl">{step.icon}</span>
                  </div>
                </div>
                <div className="flex-1 bg-white dark:bg-surface-dark border border-gray-100 dark:border-border-dark rounded-2xl p-6 transition-all hover:border-primary/50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold dark:text-white">{step.title}</h3>
                    </div>
                    <span className="bg-gray-100 dark:bg-border-dark text-slate-500 dark:text-slate-400 px-2 py-1 rounded text-[10px] font-bold uppercase">{step.tag}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-surface-dark border-2 border-primary/20 rounded-2xl p-6 shadow-xl space-y-6">
            <h3 className="font-bold dark:text-white">{t.download}</h3>
            <button className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-orange-600 transition-colors">PDF Guide</button>
          </div>

          <div className="bg-gradient-to-br from-surface-dark to-black p-6 rounded-2xl border border-border-dark">
            <h4 className="font-bold text-white mb-2">{t.cta}</h4>
            <Link to="/course-details" className="text-primary text-xs font-bold hover:underline flex items-center gap-1">{t.ctaLink} <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceGuide;
