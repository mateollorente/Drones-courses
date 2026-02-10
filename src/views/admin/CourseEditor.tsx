import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, Course, Module, Lesson, ContentBlock, generateId } from '../../utils/db';

const CourseEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isNew = !id;

    const [course, setCourse] = useState<Course>({
        id: generateId(),
        title: '',
        description: '',
        thumbnail: '',
        published: false,
        price: '',
        duration: '',
        level: '',
        modules: []
    });

    useEffect(() => {
        if (!isNew && id) {
            const existing = db.getCourseById(id);
            if (existing) {
                // Backward compatibility: Ensure blocks exist if content exists
                const migratedCourse = { ...existing };
                migratedCourse.modules = existing.modules.map(m => ({
                    ...m,
                    lessons: m.lessons.map(l => {
                        if (l.type === 'theory' && (!l.blocks || l.blocks.length === 0) && l.content) {
                            return {
                                ...l,
                                blocks: [{ id: generateId(), type: 'text', content: l.content }]
                            } as Lesson;
                        }
                        return l;
                    })
                }));
                setCourse(migratedCourse);
            }
        }
    }, [id, isNew]);

    const handleSave = () => {
        try {
            console.log("Intentando guardar curso:", course);
            if (!course.title) {
                alert('El título es obligatorio');
                return;
            }

            // Sync blocks back to content for backward compatibility (optional but safety net)
            const finalCourse = { ...course };
            finalCourse.modules = finalCourse.modules.map(m => ({
                ...m,
                lessons: m.lessons.map(l => {
                    if (l.type === 'theory' && l.blocks) {
                        const textContent = l.blocks
                            .filter(b => b.type === 'text')
                            .map(b => b.content)
                            .join('\n\n');
                        return { ...l, content: textContent };
                    }
                    return l;
                })
            }));

            const success = db.saveCourse(finalCourse);
            if (success) {
                alert('Curso guardado correctamente');
                navigate('/admin');
            } else {
                alert('Hubo un error al guardar el curso. Revisa la consola para más detalles.');
            }
        } catch (e) {
            console.error(e);
            alert('Error inesperado al guardar: ' + e);
        }
    };

    const addModule = () => {
        const newModule: Module = {
            id: generateId(),
            title: 'Nuevo Módulo',
            lessons: []
        };
        setCourse({ ...course, modules: [...course.modules, newModule] });
    };

    const updateModuleTitle = (modId: string, title: string) => {
        const updatedModules = course.modules.map(m => m.id === modId ? { ...m, title } : m);
        setCourse({ ...course, modules: updatedModules });
    };

    const addLesson = (modId: string) => {
        const newLesson: Lesson = {
            id: generateId(),
            title: 'Nueva Lección',
            type: 'theory',
            content: '',
            blocks: [
                { id: generateId(), type: 'text', content: '# Nueva Lección\nEmpezar a escribir...' }
            ],
            duration: '10 min'
        };
        const updatedModules = course.modules.map(m => {
            if (m.id === modId) {
                return { ...m, lessons: [...m.lessons, newLesson] };
            }
            return m;
        });
        setCourse({ ...course, modules: updatedModules });
    };

    const updateLesson = (modId: string, lessonId: string, field: string, value: any) => {
        const updatedModules = course.modules.map(m => {
            if (m.id === modId) {
                const updatedLessons = m.lessons.map(l => l.id === lessonId ? { ...l, [field]: value } : l);
                return { ...m, lessons: updatedLessons };
            }
            return m;
        });
        setCourse({ ...course, modules: updatedModules });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCourse({ ...course, thumbnail: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    // --- Quiz Helpers ---
    const initQuizData = (modId: string, lessonId: string) => {
        const lesson = course.modules.find(m => m.id === modId)?.lessons.find(l => l.id === lessonId);
        if (lesson && !lesson.quizData) {
            updateLesson(modId, lessonId, 'quizData', {
                question: '¿Escribe tu pregunta aquí?',
                options: [
                    { id: generateId(), text: 'Opción A', isCorrect: false },
                    { id: generateId(), text: 'Opción B', isCorrect: true }
                ]
            });
        }
    };

    const updateQuizField = (modId: string, lessonId: string, field: 'question' | 'options', value: any) => {
        const module = course.modules.find(m => m.id === modId);
        const lesson = module?.lessons.find(l => l.id === lessonId);
        if (lesson && lesson.quizData) {
            const newQuizData = { ...lesson.quizData, [field]: value };
            updateLesson(modId, lessonId, 'quizData', newQuizData);
        }
    };

    const addOption = (modId: string, lessonId: string) => {
        const module = course.modules.find(m => m.id === modId);
        const lesson = module?.lessons.find(l => l.id === lessonId);
        if (lesson && lesson.quizData) {
            const newOptions = [...lesson.quizData.options, { id: generateId(), text: 'Nueva Opción', isCorrect: false }];
            updateQuizField(modId, lessonId, 'options', newOptions);
        }
    };

    const removeOption = (modId: string, lessonId: string, optId: string) => {
        const module = course.modules.find(m => m.id === modId);
        const lesson = module?.lessons.find(l => l.id === lessonId);
        if (lesson && lesson.quizData) {
            const newOptions = lesson.quizData.options.filter(o => o.id !== optId);
            updateQuizField(modId, lessonId, 'options', newOptions);
        }
    };

    const updateOptionText = (modId: string, lessonId: string, optId: string, text: string) => {
        const module = course.modules.find(m => m.id === modId);
        const lesson = module?.lessons.find(l => l.id === lessonId);
        if (lesson && lesson.quizData) {
            const newOptions = lesson.quizData.options.map(o => o.id === optId ? { ...o, text } : o);
            updateQuizField(modId, lessonId, 'options', newOptions);
        }
    };

    const setCorrectOption = (modId: string, lessonId: string, optId: string) => {
        const module = course.modules.find(m => m.id === modId);
        const lesson = module?.lessons.find(l => l.id === lessonId);
        if (lesson && lesson.quizData) {
            const newOptions = lesson.quizData.options.map(o => ({ ...o, isCorrect: o.id === optId }));
            updateQuizField(modId, lessonId, 'options', newOptions);
        }
    };

    // --- Block Helpers ---
    const addBlock = (modId: string, lessonId: string, type: 'text' | 'image' | 'video') => {
        const newBlock: ContentBlock = {
            id: generateId(),
            type,
            content: type === 'text' ? 'Nuevo contenido...' : ''
        };
        const module = course.modules.find(m => m.id === modId);
        const lesson = module?.lessons.find(l => l.id === lessonId);
        if (lesson) {
            const currentBlocks = lesson.blocks || [];
            updateLesson(modId, lessonId, 'blocks', [...currentBlocks, newBlock]);
        }
    };

    const updateBlock = (modId: string, lessonId: string, blockId: string, content: string) => {
        const module = course.modules.find(m => m.id === modId);
        const lesson = module?.lessons.find(l => l.id === lessonId);
        if (lesson && lesson.blocks) {
            const newBlocks = lesson.blocks.map(b => b.id === blockId ? { ...b, content } : b);
            updateLesson(modId, lessonId, 'blocks', newBlocks);
        }
    };

    const removeBlock = (modId: string, lessonId: string, blockId: string) => {
        const module = course.modules.find(m => m.id === modId);
        const lesson = module?.lessons.find(l => l.id === lessonId);
        if (lesson && lesson.blocks) {
            const newBlocks = lesson.blocks.filter(b => b.id !== blockId);
            updateLesson(modId, lessonId, 'blocks', newBlocks);
        }
    };

    const moveBlock = (modId: string, lessonId: string, blockId: string, direction: 'up' | 'down') => {
        const module = course.modules.find(m => m.id === modId);
        const lesson = module?.lessons.find(l => l.id === lessonId);
        if (lesson && lesson.blocks) {
            const index = lesson.blocks.findIndex(b => b.id === blockId);
            if (index === -1) return;

            const newBlocks = [...lesson.blocks];
            if (direction === 'up' && index > 0) {
                [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
            } else if (direction === 'down' && index < newBlocks.length - 1) {
                [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
            }
            updateLesson(modId, lessonId, 'blocks', newBlocks);
        }
    };

    const handleBlockMediaUpload = (e: React.ChangeEvent<HTMLInputElement>, modId: string, lessonId: string, blockId: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateBlock(modId, lessonId, blockId, reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white p-8">
            <header className="max-w-5xl mx-auto flex justify-between items-center mb-8 sticky top-0 bg-background-light dark:bg-background-dark py-4 z-10 border-b border-gray-200 dark:border-[#393028]">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin')} className="p-2 hover:bg-gray-200 dark:hover:bg-[#393028] rounded-lg">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-2xl font-bold font-display">{isNew ? 'Crear Nuevo Curso' : 'Editar Curso'}</h1>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#1e1a16] p-1 rounded-lg border border-gray-200 dark:border-[#393028]">
                        <button
                            type="button"
                            onClick={() => setCourse({ ...course, published: false })}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${!course.published ? 'bg-white dark:bg-[#393028] text-slate-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Borrador
                        </button>
                        <button
                            type="button"
                            onClick={() => setCourse({ ...course, published: true })}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${course.published ? 'bg-green-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Publicado
                        </button>
                    </div>
                    <button type="button" onClick={handleSave} className="bg-primary text-black font-bold px-6 py-2 rounded-lg hover:bg-[#ff9529] shadow-lg">
                        Guardar Cambios
                    </button>
                </div>
            </header>

            <div className="max-w-5xl mx-auto space-y-8">
                {/* Basic Info */}
                <section className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-200 dark:border-[#393028] space-y-4">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><span className="material-symbols-outlined">info</span> Información Básica</h2>
                    <div>
                        <label className="block text-sm font-bold mb-1 ml-1 text-gray-500">Título del Curso</label>
                        <input className="w-full bg-gray-50 dark:bg-[#1e1a16] border border-gray-200 dark:border-[#393028] p-3 rounded-lg font-bold text-lg" value={course.title} onChange={e => setCourse({ ...course, title: e.target.value })} placeholder="Ej: Fotogrametría Avanzada" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1 ml-1 text-gray-500">Descripción</label>
                        <textarea className="w-full bg-gray-50 dark:bg-[#1e1a16] border border-gray-200 dark:border-[#393028] p-3 rounded-lg" rows={3} value={course.description} onChange={e => setCourse({ ...course, description: e.target.value })} placeholder="Breve descripción del curso..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-1 ml-1 text-gray-500">Imagen de Portada</label>
                            <div className="flex gap-4 items-center">
                                {course.thumbnail && (
                                    <img src={course.thumbnail} alt="Preview" className="h-16 w-16 mobile-cover rounded-lg border border-gray-300" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1 ml-1 text-gray-500">Precio</label>
                            <input className="w-full bg-gray-50 dark:bg-[#1e1a16] border border-gray-200 dark:border-[#393028] p-3 rounded-lg" value={course.price} onChange={e => setCourse({ ...course, price: e.target.value })} placeholder="Ej: 199€" />
                        </div>
                    </div>
                </section>

                {/* Modules Builder */}
                <section className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold font-display">Contenido del Curso</h2>
                        <button onClick={addModule} className="text-sm font-bold text-primary hover:underline">+ Añadir Módulo</button>
                    </div>

                    {course.modules.length === 0 && (
                        <div className="text-center py-10 border-2 border-dashed border-gray-300 dark:border-[#393028] rounded-xl text-gray-400">
                            No hay módulos aún. ¡Añade uno para empezar!
                        </div>
                    )}

                    {course.modules.map((module, idx) => (
                        <div key={module.id} className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-[#393028] rounded-xl overflow-hidden">
                            <div className="bg-gray-50 dark:bg-[#1e1a16] p-4 border-b border-gray-200 dark:border-[#393028] flex items-center gap-4">
                                <span className="bg-gray-200 dark:bg-[#393028] h-8 w-8 flex items-center justify-center rounded font-bold text-gray-500">{idx + 1}</span>
                                <input
                                    className="flex-1 bg-transparent border-none font-bold text-lg focus:ring-0 text-slate-900 dark:text-white"
                                    value={module.title}
                                    onChange={e => updateModuleTitle(module.id, e.target.value)}
                                />
                                <button onClick={() => addLesson(module.id)} className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded font-bold hover:bg-primary hover:text-white transition-colors">
                                    + Lección
                                </button>
                            </div>
                            <div className="p-4 space-y-3">
                                {module.lessons.map(lesson => (
                                    <div key={lesson.id} className="pl-4 border-l-2 border-gray-200 dark:border-[#393028] space-y-2">
                                        <div className="flex items-center gap-2">
                                            <input
                                                className="flex-1 bg-transparent border border-gray-200 dark:border-[#393028] rounded p-2 text-sm focus:border-primary"
                                                value={lesson.title}
                                                onChange={e => updateLesson(module.id, lesson.id, 'title', e.target.value)}
                                            />
                                            <select
                                                className="bg-transparent border border-gray-200 dark:border-[#393028] rounded p-2 text-sm"
                                                value={lesson.type}
                                                onChange={e => updateLesson(module.id, lesson.id, 'type', e.target.value)}
                                            >
                                                <option value="theory">Teoría</option>
                                                <option value="quiz">Examen (Quiz)</option>
                                            </select>
                                        </div>

                                        {lesson.type === 'theory' ? (
                                            <div className="space-y-4">
                                                {!lesson.blocks || lesson.blocks.length === 0 ? (
                                                    <div className="text-center p-4 border border-dashed border-gray-300 dark:border-[#393028] rounded-lg">
                                                        <p className="text-sm text-gray-500 mb-2">No hay contenido aún</p>
                                                        <button
                                                            onClick={() => addBlock(module.id, lesson.id, 'text')}
                                                            className="text-primary text-sm font-bold hover:underline"
                                                        >
                                                            Empezar con Texto
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {lesson.blocks.map((block, bIdx) => (
                                                            <div key={block.id} className="relative group bg-gray-50 dark:bg-[#12100e] border border-gray-200 dark:border-[#393028] rounded-lg p-3">
                                                                <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-[#1e1a16] shadow-sm rounded-md border border-gray-200 dark:border-[#393028] p-1 z-10">
                                                                    <button onClick={() => moveBlock(module.id, lesson.id, block.id, 'up')} disabled={bIdx === 0} className="p-1 hover:bg-gray-100 dark:hover:bg-[#393028] rounded disabled:opacity-30">
                                                                        <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                                                                    </button>
                                                                    <button onClick={() => moveBlock(module.id, lesson.id, block.id, 'down')} disabled={bIdx === lesson.blocks!.length - 1} className="p-1 hover:bg-gray-100 dark:hover:bg-[#393028] rounded disabled:opacity-30">
                                                                        <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                                                                    </button>
                                                                    <button onClick={() => removeBlock(module.id, lesson.id, block.id)} className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded">
                                                                        <span className="material-symbols-outlined text-[16px]">delete</span>
                                                                    </button>
                                                                </div>

                                                                {block.type === 'text' && (
                                                                    <textarea
                                                                        className="w-full bg-transparent border-none p-0 text-sm font-mono focus:ring-0 resize-y min-h-[80px]"
                                                                        value={block.content}
                                                                        onChange={e => updateBlock(module.id, lesson.id, block.id, e.target.value)}
                                                                        placeholder="Escribe el contenido de la lección..."
                                                                    />
                                                                )}

                                                                {block.type === 'image' && (
                                                                    <div className="space-y-2">
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-xs font-bold text-gray-500 uppercase">Imagen</span>
                                                                            <input
                                                                                className="text-xs bg-white dark:bg-[#1e1a16] border border-gray-200 dark:border-[#393028] rounded px-2 py-1 w-2/3"
                                                                                value={block.content}
                                                                                placeholder="URL de la imagen o subir archivo ->"
                                                                                onChange={e => updateBlock(module.id, lesson.id, block.id, e.target.value)}
                                                                            />
                                                                        </div>
                                                                        {block.content && (
                                                                            <img src={block.content} alt="Block preview" className="w-full h-32 object-cover rounded-md border border-gray-200 dark:border-[#393028]" />
                                                                        )}
                                                                        <input
                                                                            type="file"
                                                                            accept="image/*"
                                                                            onChange={e => handleBlockMediaUpload(e, module.id, lesson.id, block.id)}
                                                                            className="block w-full text-xs text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                                                        />
                                                                    </div>
                                                                )}

                                                                {block.type === 'video' && (
                                                                    <div className="space-y-2">
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-xs font-bold text-gray-500 uppercase">Video</span>
                                                                            <input
                                                                                className="text-xs bg-white dark:bg-[#1e1a16] border border-gray-200 dark:border-[#393028] rounded px-2 py-1 w-2/3"
                                                                                value={block.content}
                                                                                placeholder="URL del video (YouTube, MP4, etc)"
                                                                                onChange={e => updateBlock(module.id, lesson.id, block.id, e.target.value)}
                                                                            />
                                                                        </div>
                                                                        {block.content && (
                                                                            <div className="aspect-video bg-black rounded-md overflow-hidden relative">
                                                                                {/* Simple Preview */}
                                                                                <iframe
                                                                                    src={block.content}
                                                                                    className="w-full h-full"
                                                                                    title="Video Preview"
                                                                                    frameBorder="0"
                                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                                    allowFullScreen
                                                                                ></iframe>
                                                                            </div>
                                                                        )}
                                                                        <input
                                                                            type="file"
                                                                            accept="video/*"
                                                                            onChange={e => handleBlockMediaUpload(e, module.id, lesson.id, block.id)}
                                                                            className="block w-full text-xs text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="flex gap-2 pt-2">
                                                    <button onClick={() => addBlock(module.id, lesson.id, 'text')} className="flex items-center gap-1 text-xs font-bold bg-white dark:bg-[#1e1a16] border border-gray-200 dark:border-[#393028] px-3 py-1.5 rounded hover:bg-gray-50 dark:hover:bg-[#322a24]">
                                                        <span className="material-symbols-outlined text-[16px]">text_fields</span> Texto
                                                    </button>
                                                    <button onClick={() => addBlock(module.id, lesson.id, 'image')} className="flex items-center gap-1 text-xs font-bold bg-white dark:bg-[#1e1a16] border border-gray-200 dark:border-[#393028] px-3 py-1.5 rounded hover:bg-gray-50 dark:hover:bg-[#322a24]">
                                                        <span className="material-symbols-outlined text-[16px]">image</span> Imagen
                                                    </button>
                                                    <button onClick={() => addBlock(module.id, lesson.id, 'video')} className="flex items-center gap-1 text-xs font-bold bg-white dark:bg-[#1e1a16] border border-gray-200 dark:border-[#393028] px-3 py-1.5 rounded hover:bg-gray-50 dark:hover:bg-[#322a24]">
                                                        <span className="material-symbols-outlined text-[16px]">movie</span> Video
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 dark:bg-[#12100e] border border-gray-200 dark:border-[#393028] rounded-xl p-4 space-y-4">
                                                {!lesson.quizData ? (
                                                    <button
                                                        onClick={() => initQuizData(module.id, lesson.id)}
                                                        className="text-primary text-sm font-bold hover:underline"
                                                    >
                                                        Inicializar Examen
                                                    </button>
                                                ) : (
                                                    <>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-500 mb-1">Pregunta</label>
                                                            <input
                                                                className="w-full bg-white dark:bg-[#1e1a16] border border-gray-200 dark:border-[#393028] rounded p-2 text-sm font-bold"
                                                                value={lesson.quizData.question}
                                                                onChange={e => updateQuizField(module.id, lesson.id, 'question', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="block text-xs font-bold text-gray-500">Opciones (Marca la correcta)</label>
                                                            {lesson.quizData.options.map((opt) => (
                                                                <div key={opt.id} className="flex items-center gap-2">
                                                                    <input
                                                                        type="radio"
                                                                        name={`correct-${lesson.id}`}
                                                                        checked={opt.isCorrect}
                                                                        onChange={() => setCorrectOption(module.id, lesson.id, opt.id)}
                                                                        className="text-primary focus:ring-primary"
                                                                    />
                                                                    <input
                                                                        className={`flex-1 bg-white dark:bg-[#1e1a16] border rounded p-2 text-sm ${opt.isCorrect ? 'border-green-500 ring-1 ring-green-500' : 'border-gray-200 dark:border-[#393028]'}`}
                                                                        value={opt.text}
                                                                        onChange={e => updateOptionText(module.id, lesson.id, opt.id, e.target.value)}
                                                                    />
                                                                    <button
                                                                        onClick={() => removeOption(module.id, lesson.id, opt.id)}
                                                                        className="text-red-400 hover:text-red-600 px-2"
                                                                        title="Eliminar opción"
                                                                    >
                                                                        <span className="material-symbols-outlined text-sm">remove_circle</span>
                                                                    </button>
                                                                </div>
                                                            ))}
                                                            <button
                                                                onClick={() => addOption(module.id, lesson.id)}
                                                                className="text-xs font-bold text-primary flex items-center gap-1 mt-2 hover:bg-primary/10 px-2 py-1 rounded w-fit"
                                                            >
                                                                <span className="material-symbols-outlined text-sm">add</span>
                                                                Añadir Opción
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {module.lessons.length === 0 && <p className="text-sm text-gray-400 italic ml-4">Este módulo no tiene lecciones.</p>}
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};

export default CourseEditor;
