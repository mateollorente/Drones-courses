import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

// --- Mock Data Structure for the Course ---
const courseData = {
  title: "Fundamentos de Operaciones de Vuelo",
  modules: [
    {
      title: "Módulo 1: Seguridad y Normativa",
      lessons: [
        { id: 1, title: "Introducción a la Seguridad Aérea", type: "theory" },
        { id: 2, title: "Check-list Pre-vuelo", type: "quiz" },
        { id: 3, title: "Zonas de Restricción (CTR)", type: "theory" }
      ]
    },
    {
      title: "Módulo 2: Meteorología Básica",
      lessons: [
        { id: 4, title: "Lectura de METAR", type: "theory" },
        { id: 5, title: "Viento y Turbulencia", type: "quiz" }
      ]
    }
  ]
};

const CourseLearning: React.FC = () => {
  const { language } = useLanguage();
  const [currentModuleIdx, setCurrentModuleIdx] = useState(0);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [quizSelected, setQuizSelected] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<'correct' | 'incorrect' | null>(null);

  const currentModule = courseData.modules[currentModuleIdx];
  const currentLesson = currentModule.lessons[currentLessonIdx];

  const handleNext = () => {
    // Reset quiz state
    setQuizSelected(null);
    setQuizResult(null);

    // Logic to move to next lesson or module
    if (currentLessonIdx < currentModule.lessons.length - 1) {
      setCurrentLessonIdx(currentLessonIdx + 1);
    } else if (currentModuleIdx < courseData.modules.length - 1) {
      setCurrentModuleIdx(currentModuleIdx + 1);
      setCurrentLessonIdx(0);
    }
  };

  const handlePrev = () => {
    setQuizSelected(null);
    setQuizResult(null);
    if (currentLessonIdx > 0) {
      setCurrentLessonIdx(currentLessonIdx - 1);
    } else if (currentModuleIdx > 0) {
      setCurrentModuleIdx(currentModuleIdx - 1);
      setCurrentLessonIdx(courseData.modules[currentModuleIdx - 1].lessons.length - 1);
    }
  };

  const checkAnswer = () => {
    if (quizSelected === 'correct') {
      setQuizResult('correct');
    } else {
      setQuizResult('incorrect');
    }
  };

  // --- Render Content Based on Lesson Type ---
  const renderContent = () => {
    // Example: Lesson 2 is a Quiz
    if (currentLesson.type === 'quiz') {
      return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-[#393028] p-8 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Desafío: Lista de Verificación</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
              Antes de encender los motores, detectas que una de las hélices tiene una pequeña grieta en el borde de ataque. ¿Cuál es la acción correcta?
            </p>

            <div className="space-y-3">
              {[
                { id: 'opt1', text: 'Lijar la grieta y proceder con el vuelo.', val: 'incorrect' },
                { id: 'opt2', text: 'Aplicar cinta aislante para reforzar la zona.', val: 'incorrect' },
                { id: 'opt3', text: 'Cancelar el vuelo y reemplazar la hélice.', val: 'correct' } // Correct
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${quizSelected === opt.val
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 dark:border-[#393028] hover:bg-gray-50 dark:hover:bg-[#322a24]'
                    }`}
                >
                  <input
                    type="radio"
                    name="quiz"
                    className="h-5 w-5 text-primary focus:ring-primary border-gray-300 bg-transparent"
                    onChange={() => { setQuizSelected(opt.val); setQuizResult(null); }}
                    checked={quizSelected === opt.val}
                  />
                  <span className="ml-3 font-medium text-slate-700 dark:text-gray-200">{opt.text}</span>
                </label>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-[#393028]">
              <button
                onClick={checkAnswer}
                disabled={!quizSelected}
                className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${!quizSelected
                    ? 'bg-gray-300 dark:bg-[#393028] text-gray-500 cursor-not-allowed'
                    : 'bg-primary text-[#181411] hover:bg-[#ff9529] shadow-lg'
                  }`}
              >
                Comprobar Respuesta
              </button>

              {quizResult === 'correct' && (
                <div className="mt-4 p-4 bg-green-500/20 border border-green-500/50 text-green-600 dark:text-green-400 rounded-xl text-center font-bold animate-pulse">
                  ¡Correcto! La seguridad es lo primero.
                </div>
              )}
              {quizResult === 'incorrect' && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 text-red-600 dark:text-red-400 rounded-xl text-center font-bold">
                  Incorrecto. Nunca se debe volar con hélices dañadas.
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Default: Theory Content
    return (
      <div className="prose dark:prose-invert max-w-none animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-black mb-6 text-slate-900 dark:text-white">{currentLesson.title}</h1>
        <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-6">
          La seguridad aérea no es solo una normativa, es una mentalidad. Como piloto de drones (RPAS), eres responsable no solo de tu aeronave, sino del espacio aéreo que compartes y de las personas en tierra.
        </p>

        <div className="my-8 p-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-xl">
          <h3 className="text-blue-700 dark:text-blue-300 font-bold text-lg mb-2">Concepto Clave: VLOS</h3>
          <p className="text-blue-800 dark:text-blue-200">
            <strong>Visual Line of Sight:</strong> Debes mantener el dron siempre dentro de tu campo visual directo, sin ayudas instrumentales (salvo gafas graduadas), para poder evitar colisiones.
          </p>
        </div>

        <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-6">
          Antes de cada operación, debemos evaluar tres factores críticos:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300 mb-8">
          <li><strong>Entorno:</strong> Obstáculos, personas, interferencias electromagnéticas.</li>
          <li><strong>Aeronave:</strong> Estado de baterías, hélices y sensores.</li>
          <li><strong>Factor Humano:</strong> Fatiga, estrés o presión por completar el trabajo.</li>
        </ul>

        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-[#1e1a16] border border-gray-200 dark:border-[#393028] flex items-center justify-center relative group cursor-pointer">
          <img src="https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&q=80&w=1200" alt="Video cover" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
          <div className="z-10 h-16 w-16 bg-primary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-black text-3xl">play_arrow</span>
          </div>
          <span className="absolute bottom-4 right-4 bg-black/70 px-2 py-1 rounded text-xs font-bold text-white">05:24</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background-light dark:bg-background-dark">

      {/* --- Sidebar Navigation (Curriculum) --- */}
      <aside
        className={`${sidebarOpen ? 'w-80' : 'w-0'
          } flex-shrink-0 bg-white dark:bg-[#0d0a08] border-r border-gray-200 dark:border-[#393028] transition-all duration-300 overflow-y-auto relative`}
      >
        <div className="p-6 sticky top-0 bg-white dark:bg-[#0d0a08] z-10 border-b border-gray-100 dark:border-[#393028]">
          <h2 className="font-bold text-lg dark:text-white leading-tight">{courseData.title}</h2>
          <div className="mt-2 w-full bg-gray-200 dark:bg-[#221910] h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[35%]"></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">35% Completado</p>
        </div>

        <div className="p-4 space-y-4">
          {courseData.modules.map((module, modIdx) => (
            <div key={modIdx} className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-2">{module.title}</h3>
              <div className="space-y-1">
                {module.lessons.map((lesson, lessIdx) => {
                  const isActive = modIdx === currentModuleIdx && lessIdx === currentLessonIdx;
                  // Mock logic for "completed" - simply previous lessons
                  const isCompleted = modIdx < currentModuleIdx || (modIdx === currentModuleIdx && lessIdx < currentLessonIdx);

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => { setCurrentModuleIdx(modIdx); setCurrentLessonIdx(lessIdx); setQuizResult(null); setQuizSelected(null); }}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${isActive
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1e1a16]'
                        }`}
                    >
                      <div className={`h-5 w-5 rounded-full flex items-center justify-center border ${isCompleted ? 'bg-green-500 border-green-500' :
                          isActive ? 'border-primary' : 'border-gray-400'
                        }`}>
                        {isCompleted && <span className="material-symbols-outlined text-white text-[14px] font-bold">check</span>}
                        {isActive && !isCompleted && <div className="h-2 w-2 bg-primary rounded-full" />}
                      </div>
                      <span className={`text-sm font-medium line-clamp-1 ${isActive ? 'font-bold' : ''}`}>
                        {lesson.title}
                      </span>
                      {lesson.type === 'quiz' && (
                        <span className="ml-auto material-symbols-outlined text-[16px] opacity-50">quiz</span>
                      )}
                      {lesson.type === 'theory' && (
                        <span className="ml-auto material-symbols-outlined text-[16px] opacity-50">article</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 flex flex-col min-w-0 relative">

        {/* Toolbar */}
        <div className="h-14 border-b border-gray-200 dark:border-[#393028] flex items-center justify-between px-4 bg-white/50 dark:bg-[#12100e]/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-200 dark:hover:bg-[#2a2018] rounded-lg transition-colors text-slate-700 dark:text-white">
              <span className="material-symbols-outlined">{sidebarOpen ? 'menu_open' : 'menu'}</span>
            </button>
            <div className="h-4 w-px bg-gray-300 dark:bg-[#393028] mx-2 hidden sm:block"></div>
            <nav className="hidden sm:flex text-sm text-gray-500 dark:text-gray-400 items-center gap-2">
              <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
              <span>/</span>
              <span className="truncate max-w-[200px]">{courseData.title}</span>
            </nav>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#393028] text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1e1a16] transition-colors">
              <span className="material-symbols-outlined text-[18px]">help</span>
              <span className="hidden sm:inline">Ayuda</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scroll-smooth p-6 md:p-12 md:max-w-4xl md:mx-auto w-full">
          {renderContent()}

          {/* Navigation Footer */}
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-[#393028] flex justify-between">
            <button
              onClick={handlePrev}
              disabled={currentModuleIdx === 0 && currentLessonIdx === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 dark:border-[#393028] font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1e1a16] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Anterior
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-white dark:bg-white text-black font-bold hover:bg-gray-200 shadow-lg transition-colors"
            >
              Siguiente Lección
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};

export default CourseLearning;
