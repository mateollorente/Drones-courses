import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db, Course } from '../../utils/db';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        setCourses(db.getCourses());
    }, []);

    const handleDelete = (id: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar este curso?')) {
            db.deleteCourse(id);
            setCourses(db.getCourses());
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white flex">
            {/* Simple Sidebar */}
            <aside className="w-64 bg-surface-dark border-r border-[#393028] p-6 hidden md:block">
                <div className="flex items-center gap-2 mb-10 text-primary">
                    <span className="material-symbols-outlined text-3xl">shield_person</span>
                    <span className="font-bold text-xl">Admin Panel</span>
                </div>
                <nav className="space-y-2">
                    <Link to="/admin" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary border border-primary/20 rounded-lg">
                        <span className="material-symbols-outlined">dashboard</span>
                        Dashboard
                    </Link>
                    <Link to="/admin/messages" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">chat</span>
                        Mensajes
                    </Link>
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">home</span>
                        Ver Sitio Web
                    </Link>
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">school</span>
                        Vista Estudiante
                    </Link>
                </nav>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-display">Gestión de Cursos</h1>
                        <p className="text-gray-400 mt-1">Bienvenido, {user?.name}</p>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/admin/courses/new" className="bg-primary text-black font-bold px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[#ff9529] transition-colors shadow-lg">
                            <span className="material-symbols-outlined">add</span>
                            Nuevo Curso
                        </Link>
                        <button onClick={logout} className="border border-[#393028] text-gray-400 hover:text-white px-4 py-3 rounded-lg">
                            Salir
                        </button>
                    </div>
                </header>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-surface-dark border border-[#393028] p-6 rounded-2xl">
                        <h3 className="text-gray-400 text-sm uppercase font-bold text-xs mb-2">Total Cursos</h3>
                        <p className="text-4xl font-black text-white">{courses.length}</p>
                    </div>
                    <div className="bg-surface-dark border border-[#393028] p-6 rounded-2xl">
                        <h3 className="text-gray-400 text-sm uppercase font-bold text-xs mb-2">Total Alumnos</h3>
                        <p className="text-4xl font-black text-white">{db.getUsers().filter(u => u.role === 'student').length}</p>
                    </div>
                    <div className="bg-surface-dark border border-[#393028] p-6 rounded-2xl">
                        <h3 className="text-gray-400 text-sm uppercase font-bold text-xs mb-2">Cursos Publicados</h3>
                        <p className="text-4xl font-black text-primary">{courses.filter(c => c.published).length}</p>
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <div key={course.id} className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-[#393028] rounded-2xl overflow-hidden shadow-sm group hover:border-primary/50 transition-colors">
                            <div className="h-48 overflow-hidden relative">
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full">
                                    {course.published ? 'Publicado' : 'Borrador'}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 line-clamp-1 dark:text-white">{course.title}</h3>
                                <p className="text-gray-500 text-sm mb-6 line-clamp-2">{course.description}</p>

                                <div className="flex gap-2">
                                    <Link to={`/admin/courses/edit/${course.id}`} className="flex-1 bg-gray-100 dark:bg-[#393028] text-gray-700 dark:text-gray-300 font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-[#4d4239] transition-colors">
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                        Editar
                                    </Link>
                                    <button onClick={() => handleDelete(course.id)} className="px-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
