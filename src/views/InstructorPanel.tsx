import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../context/LanguageContext';

const data = [
  { name: 'Jan', performance: 65 },
  { name: 'Feb', performance: 75 },
  { name: 'Mar', performance: 70 },
  { name: 'Apr', performance: 85 },
  { name: 'May', performance: 80 },
  { name: 'Jun', performance: 92 },
];

const InstructorPanel: React.FC = () => {
  const { language } = useLanguage();

  const translations = {
    es: { title: 'Panel del Instructor' },
    en: { title: 'Instructor Dashboard' }
  };
  const t = translations[language];

  return (
    <div className="flex-1 p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-display dark:text-white">{t.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Chart */}
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#1e1a16] border border-slate-200 dark:border-[#393028]">
          <h2 className="font-bold mb-4 dark:text-white">Rendimiento de Alumnos</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f08519" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f08519" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#393028" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} dy={10} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e1a16', border: '1px solid #393028' }}
                  itemStyle={{ color: '#f08519' }}
                />
                <Area type="monotone" dataKey="performance" stroke="#f08519" strokeWidth={3} fillOpacity={1} fill="url(#colorPerf)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Messages Widget */}
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#1e1a16] border border-slate-200 dark:border-[#393028] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold dark:text-white">Mensajes Recientes</h2>
            <a href="/admin/messages" className="text-primary text-sm hover:underline">Ver todos</a>
          </div>
          <div className="flex-1 bg-gray-50 dark:bg-black/20 rounded-xl p-4 flex items-center justify-center text-center">
            <div>
              <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">forum</span>
              <p className="text-gray-500 text-sm">Accede al panel de mensajes para responder a tus alumnos.</p>
              <a href="/admin/messages" className="mt-4 inline-block bg-primary text-black font-bold py-2 px-4 rounded-lg hover:bg-[#ff9529] transition-colors">
                Ir a Mensajes
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorPanel;
