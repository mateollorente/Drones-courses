import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { db, Course, UserProgress } from '../utils/db';
import ChatWidget from '../components/ChatWidget';

const CourseLearning: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId');

  const [course, setCourse] = useState<Course | null>(null);
  const [currentModuleIdx, setCurrentModuleIdx] = useState(0);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [quizSelected, setQuizSelected] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<'correct' | 'incorrect' | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (courseId && user) {
        // Check enrollment first
        const isEnrolled = await db.isEnrolled(user.email, courseId);
        if (!isEnrolled) {
          navigate('/dashboard');
          return;
        }

        const foundCourse = await db.getCourseById(courseId);
        if (foundCourse) {
          setCourse(foundCourse);
          // Restore progress
          const progress = await db.getProgress(user.email, courseId);
          if (progress) {
            setCurrentModuleIdx(progress.currentModuleIdx);
            setCurrentLessonIdx(progress.currentLessonIdx);
            setCompletedLessons(progress.completedLessons || []);
          }
        }
      }
    };
    fetchCourseData();
  }, [courseId, user, navigate]);

  const saveProgress = async (modIdx: number, lessIdx: number, newCompleted?: string[]) => {
    if (user && courseId) {
      const finalCompleted = newCompleted || completedLessons;
      const newProgress: UserProgress = {
        courseId,
        currentModuleIdx: modIdx,
        currentLessonIdx: lessIdx,
        completedLessons: finalCompleted,
        lastAccessed: Date.now()
      };
      await db.saveProgress(user.email, newProgress);
    }
  };

  const markLessonAsCompleted = (lessonId: string): string[] => {
    if (!completedLessons.includes(lessonId)) {
      const newCompleted = [...completedLessons, lessonId];
      setCompletedLessons(newCompleted);

      // Check for completion
      if (course) {
        const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
        if (newCompleted.length === totalLessons) {
          setShowCongrats(true);
        }
      }
      return newCompleted;
    }
    return completedLessons;
  };

  if (!course) {
    return (
      <div className="flex h-screen items-center justify-center dark:text-white">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Cargando curso...</h2>
          <p>Si esto tarda demasiado, el curso podría no existir.</p>
          <Link to="/dashboard" className="text-primary hover:underline mt-4 block">Volver al Panel</Link>
        </div>
      </div>
    );
  }

  const currentModule = course.modules[currentModuleIdx];
  const currentLesson = currentModule?.lessons[currentLessonIdx];

  if (!currentLesson) return <div>Error: Lección no encontrada</div>;

  const handleNext = async () => {
    let currentCompletedLessons = completedLessons;

    // Mark current as completed before moving
    if (currentLesson) {
      currentCompletedLessons = markLessonAsCompleted(currentLesson.id);
    }

    setQuizSelected(null);
    setQuizResult(null);

    if (currentLessonIdx < currentModule.lessons.length - 1) {
      setCurrentLessonIdx(currentLessonIdx + 1);
      await saveProgress(currentModuleIdx, currentLessonIdx + 1, currentCompletedLessons);
    } else if (currentModuleIdx < course.modules.length - 1) {
      setCurrentModuleIdx(currentModuleIdx + 1);
      setCurrentLessonIdx(0);
      await saveProgress(currentModuleIdx + 1, 0, currentCompletedLessons);
    } else {
      // Last lesson of last module
      await saveProgress(currentModuleIdx, currentLessonIdx, currentCompletedLessons);
    }
  };

  const handlePrev = async () => {
    setQuizSelected(null);
    setQuizResult(null);
    if (currentLessonIdx > 0) {
      setCurrentLessonIdx(currentLessonIdx - 1);
      await saveProgress(currentModuleIdx, currentLessonIdx - 1);
    } else if (currentModuleIdx > 0) {
      setCurrentModuleIdx(currentModuleIdx - 1);
      const prevModLessons = course.modules[currentModuleIdx - 1].lessons;
      const newLessonIdx = prevModLessons.length - 1;
      setCurrentLessonIdx(newLessonIdx);
      await saveProgress(currentModuleIdx - 1, newLessonIdx);
    }
  };

  const checkAnswer = async () => {
    if (!currentLesson.quizData) return;

    const selectedOption = currentLesson.quizData.options.find(o => o.id === quizSelected);

    if (selectedOption?.isCorrect) {
      setQuizResult('correct');
      const newCompleted = markLessonAsCompleted(currentLesson.id);
      await saveProgress(currentModuleIdx, currentLessonIdx, newCompleted);
    } else {
      setQuizResult('incorrect');
    }
  };

  const renderContent = () => {
    if (currentLesson.type === 'quiz' && currentLesson.quizData) {
      return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-[#393028] p-8 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Desafío: {currentLesson.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
              {currentLesson.quizData.question}
            </p>

            <div className="space-y-3">
              {currentLesson.quizData.options.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${quizSelected === opt.id
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 dark:border-[#393028] hover:bg-gray-50 dark:hover:bg-[#322a24]'
                    }`}
                >
                  <input
                    type="radio"
                    name="quiz"
                    className="h-5 w-5 text-primary focus:ring-primary border-gray-300 bg-transparent"
                    onChange={() => { setQuizSelected(opt.id); setQuizResult(null); }}
                    checked={quizSelected === opt.id}
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
                  ¡Correcto! Bien hecho.
                </div>
              )}
              {quizResult === 'incorrect' && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 text-red-600 dark:text-red-400 rounded-xl text-center font-bold">
                  Incorrecto. Inténtalo de nuevo.
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Default: Theory Content
    const blocks = currentLesson.blocks || (currentLesson.content ? [{ id: 'legacy', type: 'text', content: currentLesson.content }] : []);

    return (
      <div className="prose dark:prose-invert max-w-none animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
        <div>
          <h1 className="text-3xl font-black mb-2 text-slate-900 dark:text-white">{currentLesson.title}</h1>
        </div>

        {blocks.map((block: any) => {
          if (block.type === 'text') {
            return (
              <div key={block.id} className="whitespace-pre-wrap text-lg leading-relaxed text-gray-600 dark:text-gray-300 font-sans">
                {block.content}
              </div>
            );
          }
          if (block.type === 'image') {
            return (
              <div key={block.id} className="my-6">
                <img src={block.content} alt="" className="rounded-xl w-full border border-gray-200 dark:border-[#393028] shadow-sm" />
              </div>
            );
          }
          if (block.type === 'video') {
            return (
              <div key={block.id} className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-gray-200 dark:border-[#393028] relative group my-6">
                {block.content ? (
                  <iframe
                    src={block.content}
                    className="w-full h-full"
                    title="Lesson Component"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">Video no disponible</div>
                )}
              </div>
            );
          }
          return null;
        })}
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
          <h2 className="font-bold text-lg dark:text-white leading-tight">{course.title}</h2>
          <div className="mt-2 w-full bg-gray-200 dark:bg-[#221910] h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[35%]"></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Progreso Guardado</p>
        </div>

        <div className="p-4 space-y-4">
          {course.modules.map((module, modIdx) => (
            <div key={module.id} className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-2">{module.title}</h3>
              <div className="space-y-1">
                {module.lessons.map((lesson, lessIdx) => {
                  const isActive = modIdx === currentModuleIdx && lessIdx === currentLessonIdx;
                  const isCompleted = completedLessons.includes(lesson.id);

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => { setCurrentModuleIdx(modIdx); setCurrentLessonIdx(lessIdx); setQuizResult(null); setQuizSelected(null); saveProgress(modIdx, lessIdx); }}
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
              <span className="truncate max-w-[200px]">{course.title}</span>
            </nav>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowChat(!showChat)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm font-bold transition-colors ${showChat
                ? 'bg-primary text-black border-primary'
                : 'border-gray-200 dark:border-[#393028] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1e1a16]'
                }`}
            >
              <span className="material-symbols-outlined text-[18px]">support_agent</span>
              <span className="hidden sm:inline">Instructor</span>
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

      {/* Congrats Modal */}
      {
        showCongrats && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-500">
            <div className="bg-white dark:bg-[#1e1a16] max-w-lg w-full rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-yellow-400 to-primary animate-pulse"></div>

              <div className="mb-6 inline-flex items-center justify-center h-24 w-24 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500 mb-6">
                <span className="material-symbols-outlined text-6xl">emoji_events</span>
              </div>

              <h2 className="text-3xl font-black mb-2 text-slate-900 dark:text-white">¡FELICIDADES!</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                Has completado el curso <br />
                <span className="text-primary font-bold">{course.title}</span>
              </p>

              <div className="bg-gray-50 dark:bg-[#0d0a08] p-4 rounded-xl border border-dashed border-gray-300 dark:border-[#393028] mb-8">
                <p className="text-sm text-gray-500">Certificado generado para:</p>
                <p className="font-bold text-lg dark:text-white">{user?.name}</p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:bg-[#ff9529] shadow-lg transition-transform hover:scale-[1.02]"
                >
                  Volver al Dashboard
                </button>
                <button
                  onClick={() => setShowCongrats(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-sm"
                >
                  Cerrar y explorar contenido
                </button>
              </div>
            </div>
          </div>
        )
      }
      {showChat && <ChatWidget onClose={() => setShowChat(false)} />}
    </div >
  );
};

export default CourseLearning;
