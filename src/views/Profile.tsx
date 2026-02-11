import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../utils/db';
import { useLanguage } from '../context/LanguageContext';

const Profile: React.FC = () => {
    const { user, login } = useAuth(); // We might need login/logout or a way to refresh user
    const { language } = useLanguage();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!user) return;

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: language === 'es' ? 'Las contraseñas no coinciden' : 'Passwords do not match' });
            return;
        }

        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: language === 'es' ? 'La contraseña debe tener al menos 6 caracteres' : 'Password must be at least 6 characters' });
            return;
        }

        // Verify current password (simple check against current user object)
        if (user.password !== currentPassword) {
            setMessage({ type: 'error', text: language === 'es' ? 'Contraseña actual incorrecta' : 'Incorrect current password' });
            return;
        }

        // Update password
        const success = await db.updateUser(user.email, { password: newPassword });
        if (success) {
            setMessage({ type: 'success', text: language === 'es' ? 'Contraseña actualizada correctamente' : 'Password updated successfully' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setMessage({ type: 'error', text: language === 'es' ? 'Error al actualizar la contraseña' : 'Error updating password' });
        }
    };

    const t = {
        es: {
            title: 'Mi Perfil',
            personalInfo: 'Información Personal',
            security: 'Seguridad',
            name: 'Nombre Completo',
            email: 'Correo Electrónico',
            dni: 'DNI / Identificación',
            role: 'Rol de Usuario',
            changeDiff: 'Cambiar Contraseña',
            currentPass: 'Contraseña Actual',
            newPass: 'Nueva Contraseña',
            confirmPass: 'Confirmar Nueva Contraseña',
            update: 'Actualizar Contraseña'
        },
        en: {
            title: 'My Profile',
            personalInfo: 'Personal Information',
            security: 'Security',
            name: 'Full Name',
            email: 'Email Address',
            dni: 'DNI / ID',
            role: 'User Role',
            changeDiff: 'Change Password',
            currentPass: 'Current Password',
            newPass: 'New Password',
            confirmPass: 'Confirm New Password',
            update: 'Update Password'
        }
    }[language];


    if (!user) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">

                <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white">{t.title}</h1>

                {/* Personal Info Card */}
                <div className="bg-white dark:bg-surface-dark shadow border border-gray-200 dark:border-[#393028] rounded-2xl p-6 md:p-8">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">person</span>
                        {t.personalInfo}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t.name}</label>
                            <div className="text-lg font-medium text-slate-900 dark:text-white">{user.name}</div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t.email}</label>
                            <div className="text-lg font-medium text-slate-900 dark:text-white">{user.email}</div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t.dni}</label>
                            <div className="text-lg font-medium text-slate-900 dark:text-white font-mono">{user.dni || '-'}</div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t.role}</label>
                            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20 capitalize">
                                {user.role}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Card */}
                <div className="bg-white dark:bg-surface-dark shadow border border-gray-200 dark:border-[#393028] rounded-2xl p-6 md:p-8">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">lock</span>
                        {t.security}
                    </h2>

                    <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">{t.changeDiff}</h3>

                        {message && (
                            <div className={`p-3 rounded-lg text-sm font-bold mb-4 ${message.type === 'success' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                                {message.text}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.currentPass}</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full rounded-lg border-gray-300 dark:border-[#393028] dark:bg-black/20 dark:text-white focus:border-primary focus:ring-primary"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.newPass}</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full rounded-lg border-gray-300 dark:border-[#393028] dark:bg-black/20 dark:text-white focus:border-primary focus:ring-primary"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.confirmPass}</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full rounded-lg border-gray-300 dark:border-[#393028] dark:bg-black/20 dark:text-white focus:border-primary focus:ring-primary"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-primary text-black font-bold py-2 px-6 rounded-lg hover:bg-[#ff9529] transition-colors shadow-lg"
                        >
                            {t.update}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Profile;
