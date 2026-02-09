import React from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../context/LanguageContext';

const data = [
  { name: 'Lun', hours: 2 },
  { name: 'Mar', hours: 4.5 },
  { name: 'Mie', hours: 1.5 },
  { name: 'Jue', hours: 5 },
  { name: 'Vie', hours: 3 },
  { name: 'Sab', hours: 6 },
  { name: 'Dom', hours: 4 },
];

const Dashboard: React.FC = () => {
  const { language } = useLanguage();

  const translations = {
    es: {
      welcome: 'Bienvenido de nuevo, Piloto Alex',
      ready: '¿Listo para el despegue? Retoma tu formación donde la dejaste.',
      launch: 'Entrar al Simulador',
      quick: 'LANZAMIENTO RÁPIDO',
      activeCourse: 'Curso Activo',
      continue: 'Continuar Lección',
      progress: 'Progreso General',
      nextLesson: 'Siguiente: Zonas de Restricción (CTR)',
      hoursFlown: 'Horas de Vuelo',
      stat1: '24h',
      stat1Label: 'Total Vuelo',
      stat2: '85%',
      stat2Label: 'Precisión',
      stat3: '12',
      stat3Label: 'Misiones'
    },
    en: {
      welcome: 'Welcome back, Pilot Alex',
      ready: 'Ready for takeoff? Resume your training where you left off.',
      launch: 'Enter Simulator',
      quick: 'QUICK LAUNCH',
      activeCourse: 'Active Course',
      continue: 'Continue Lesson',
      progress: 'Overall Progress',
      nextLesson: 'Next: Restriction Zones (CTR)',
      hoursFlown: 'Flight Hours',
      stat1: '24h',
      stat1Label: 'Total Flight',
      stat2: '85%',
      stat2Label: 'Accuracy',
      stat3: '12',
      stat3Label: 'Missions'
    }
  };

  const t = translations[language];

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8 lg:p-10 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">{t.welcome}</h1>
          <p className="mt-2 text-slate-600 dark:text-[#baab9c]">{t.ready}</p>
        </div>
        <Link to="/simulator" className="group relative flex items-center gap-3 overflow-hidden rounded-xl bg-primary px-6 py-4 text-white shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] hover:shadow-primary/50">
          <div className="relative z-10 flex flex-col text-left">
            <span className="text-xs font-medium uppercase tracking-wider opacity-90 text-black">{t.quick}</span>
            <span className="text-lg font-bold text-black">{t.launch}</span>
          </div>
          <span className="material-symbols-outlined relative z-10 text-3xl text-black transition-transform group-hover:translate-x-1">rocket_launch</span>
          <div className="absolute inset-0 -z-0 bg-gradient-to-r from-transparent to-black/10"></div>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Active Course Card */}
          <div className="relative overflow-hidden rounded-2xl bg-surface-dark border border-[#393028] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="h-24 w-24 shrink-0 rounded-xl bg-gray-800 border border-[#393028] overflow-hidden relative shadow-lg">
              <img src="https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=400" className="h-full w-full object-cover" alt="Course" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-sm">play_arrow</span>
                </div>
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left z-10">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">{t.activeCourse}</span>
                <span className="text-gray-500 text-xs">Módulo 1 • Lección 3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Fundamentos de Operaciones de Vuelo</h3>
              <p className="text-gray-400 text-sm mb-4">{t.nextLesson}</p>

              <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden mb-1">
                <div className="bg-primary h-full w-[35%] shadow-[0_0_10px_#f08519]"></div>
              </div>
            </div>

            <Link to="/learn" className="z-10 bg-white hover:bg-gray-100 text-black font-bold py-3 px-6 rounded-lg shadow-lg transition-colors whitespace-nowrap">
              {t.continue}
            </Link>
          </div>

          {/* Activity Chart */}
          <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-[#393028] p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg dark:text-white">{t.hoursFlown}</h3>
              <select className="bg-transparent border border-gray-200 dark:border-[#393028] text-sm rounded-lg px-3 py-1 dark:text-gray-400">
                <option>Esta Semana</option>
                <option>Este Mes</option>
              </select>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f08519" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f08519" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e1a16', border: '1px solid #393028', borderRadius: '8px' }}
                    itemStyle={{ color: '#f08519' }}
                    cursor={{ stroke: '#f08519', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                  <YAxis hide />
                  <Area type="monotone" dataKey="hours" stroke="#f08519" strokeWidth={3} fill="url(#colorHours)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-[#393028] p-4 rounded-2xl">
              <div className="text-3xl font-bold dark:text-white mb-1">{t.stat1}</div>
              <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">{t.stat1Label}</div>
            </div>
            <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-[#393028] p-4 rounded-2xl">
              <div className="text-3xl font-bold dark:text-white mb-1">{t.stat2}</div>
              <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">{t.stat2Label}</div>
            </div>
            <div className="col-span-2 bg-white dark:bg-surface-dark border border-gray-100 dark:border-[#393028] p-4 rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold dark:text-white mb-1">{t.stat3}</div>
                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">{t.stat3Label}</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                <span className="material-symbols-outlined">flag</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-b from-[#1e1a16] to-black border border-[#393028] p-6 rounded-2xl">
            <h3 className="text-white font-bold mb-4">Certificados</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 opacity-50">
                <span className="material-symbols-outlined text-gray-500">lock</span>
                <div className="text-sm text-gray-400">Licencia A1/A3</div>
              </div>
              <div className="flex items-center gap-3 opacity-50">
                <span className="material-symbols-outlined text-gray-500">lock</span>
                <div className="text-sm text-gray-400">Radiofonista</div>
              </div>
            </div>
            <button className="mt-6 w-full py-2 rounded-lg border border-[#393028] text-gray-400 text-sm hover:text-white hover:border-white transition-colors">
              Ver Requisitos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
