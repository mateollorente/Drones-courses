import React, { useEffect, useState } from 'react';
import { User, db, Course } from '../../utils/db';

interface StudentDetailsProps {
    email: string;
}

const StudentDetails: React.FC<StudentDetailsProps> = ({ email }) => {
    const [student, setStudent] = useState<User | null>(null);
    const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);

    useEffect(() => {
        const users = db.getUsers();
        const found = users.find(u => u.email === email);
        setStudent(found || null);

        if (found && found.enrolledCourses) {
            const allCourses = db.getCourses();
            const studentCourses = allCourses.filter(c => found.enrolledCourses?.includes(c.id));
            setEnrolledCourses(studentCourses);
        } else {
            setEnrolledCourses([]);
        }
    }, [email]);

    if (!student) return null;

    return (
        <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-[#393028] rounded-2xl overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 dark:border-[#393028] bg-gray-50 dark:bg-[#1e1a16]">
                <h2 className="font-bold text-lg dark:text-white">Detalles del Alumno</h2>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-primary text-3xl font-bold mb-3 border-2 border-primary">
                        {student.name.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="font-bold text-xl dark:text-white text-center">{student.name}</h3>
                    <p className="text-gray-500 text-sm">{student.email}</p>
                    <p className="text-gray-400 text-xs mt-1">DNI: {student.dni}</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <h4 className="font-bold text-sm uppercase text-gray-400 mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">school</span>
                            Cursos Inscritos
                        </h4>
                        {enrolledCourses.length > 0 ? (
                            <div className="space-y-3">
                                {enrolledCourses.map(course => {
                                    const progress = student.progress?.find(p => p.courseId === course.id);
                                    // Calculate simple progress percentage
                                    let percentage = 0;
                                    // This is a rough estimate based on module/lesson index vs total. 
                                    // For a mock, let's just use completedLessons count / total lessons estimate or just verify if completed.
                                    // Simpler: Just show status based on lastAccessed.

                                    return (
                                        <div key={course.id} className="bg-gray-50 dark:bg-black/20 p-3 rounded-xl border border-gray-100 dark:border-[#393028]">
                                            <div className="flex items-center gap-3 mb-2">
                                                <img src={course.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-sm truncate dark:text-gray-200">{course.title}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {progress ? `Último acceso: ${new Date(progress.lastAccessed).toLocaleDateString()}` : 'Nunca accedido'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm italic">No está inscrito en ningún curso.</p>
                        )}
                    </div>

                    <div>
                        <h4 className="font-bold text-sm uppercase text-gray-400 mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">info</span>
                            Información Adicional
                        </h4>
                        <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-[#393028] text-sm space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Rol:</span>
                                <span className="font-medium dark:text-gray-300 capitalize">{student.role}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">ID Usuario:</span>
                                <span className="font-mono text-xs text-gray-400 truncate max-w-[100px]" title={student.email}>{student.email.split('@')[0]}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetails;
