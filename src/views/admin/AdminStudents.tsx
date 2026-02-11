import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, User, Course } from '../../utils/db';
import { useAuth } from '../../context/AuthContext';

const AdminStudents: React.FC = () => {
    const { user, logout } = useAuth();
    const [students, setStudents] = useState<User[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
    const [studentCourses, setStudentCourses] = useState<Course[]>([]);

    useEffect(() => {
        const allUsers = db.getUsers();
        // Ensure student role
        const studentList = allUsers.filter(u => u.role === 'student');
        setStudents(studentList);
    }, []);

    const handleStudentClick = (student: User) => {
        setSelectedStudent(student);
        if (student.enrolledCourses && student.enrolledCourses.length > 0) {
            const courses = student.enrolledCourses.map(id => db.getCourseById(id)).filter((c): c is Course => !!c);
            setStudentCourses(courses);
        } else {
            setStudentCourses([]);
        }
    };

    const closeModal = () => {
        setSelectedStudent(null);
        setStudentCourses([]);
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white flex">
            {/* Simple Sidebar (Same as AdminDashboard) */}
            <aside className="w-64 bg-surface-dark border-r border-[#393028] p-6 hidden md:block">
                <div className="flex items-center gap-2 mb-10 text-primary">
                    <span className="material-symbols-outlined text-3xl">shield_person</span>
                    <span className="font-bold text-xl">Admin Panel</span>
                </div>
                <nav className="space-y-2">
                    <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">dashboard</span>
                        Dashboard
                    </Link>
                    <Link to="/admin/students" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary border border-primary/20 rounded-lg">
                        <span className="material-symbols-outlined">group</span>
                        Estudiantes
                    </Link>
                    <Link to="/admin/messages" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">chat</span>
                        Mensajes
                    </Link>
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">home</span>
                        Ver Sitio Web
                    </Link>
                </nav>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-display">Estudiantes Registrados</h1>
                        <p className="text-gray-400 mt-1">Total: {students.length}</p>
                    </div>
                </header>

                {/* Students Table */}
                <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-[#393028] rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-[#1e1a16] border-b border-gray-200 dark:border-[#393028]">
                            <tr>
                                <th className="px-6 py-4 font-bold text-sm text-gray-500 uppercase tracking-wider">Nombre Completo</th>
                                <th className="px-6 py-4 font-bold text-sm text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 font-bold text-sm text-gray-500 uppercase tracking-wider">DNI</th>
                                <th className="px-6 py-4 font-bold text-sm text-gray-500 uppercase tracking-wider">Cursos</th>
                                <th className="px-6 py-4 font-bold text-sm text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-[#393028]">
                            {students.length > 0 ? (
                                students.map((student, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => handleStudentClick(student)}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                                                    {(student.name || '?').charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium dark:text-white">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                                            {student.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-500 dark:text-gray-400">
                                            {student.dni || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/20">
                                                {student.enrolledCourses?.length || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button className="text-gray-400 hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined">visibility</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No hay estudiantes registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Student Courses Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#1e1a16] rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-[#393028]">
                        <div className="p-6 border-b border-gray-100 dark:border-[#393028] flex justify-between items-center bg-surface-dark">
                            <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">school</span>
                                Cursos de {selectedStudent.name}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            {studentCourses.length > 0 ? (
                                <div className="space-y-4">
                                    {studentCourses.map(course => {
                                        const progress = db.getProgress(selectedStudent.email, course.id);
                                        const completed = progress?.completedLessons?.length || 0;
                                        // Calculate total lessons safely
                                        const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
                                        const percent = Math.round((completed / Math.max(1, totalLessons)) * 100);

                                        return (
                                            <div key={course.id} className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-[#393028] flex gap-4">
                                                <div className="h-16 w-16 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                                                    <img src={course.thumbnail} alt="" className="h-full w-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold dark:text-white">{course.title}</h3>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                            <div className="h-full bg-primary" style={{ width: `${percent}%` }}></div>
                                                        </div>
                                                        <span className="text-xs font-bold text-primary">{percent}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                    Este estudiante no está inscrito en ningún curso.
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t border-gray-100 dark:border-[#393028] bg-gray-50 dark:bg-surface-dark flex justify-end">
                            <button onClick={closeModal} className="bg-primary text-black font-bold py-2 px-6 rounded-lg hover:bg-[#ff9529] transition-colors">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStudents;
