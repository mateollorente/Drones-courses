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
      <h1 className="text-3xl font-bold font-display dark:text-white">{t.title}</h1>
      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#1e1a16] border border-slate-200 dark:border-[#393028]">
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
    </div>
  );
};

export default InstructorPanel;
