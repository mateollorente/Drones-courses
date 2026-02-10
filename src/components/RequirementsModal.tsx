import React from 'react';

interface RequirementsModalProps {
    onClose: () => void;
}

const RequirementsModal: React.FC<RequirementsModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1e1a16] w-full max-w-lg rounded-2xl border border-gray-200 dark:border-[#393028] shadow-2xl p-0 relative overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-[#393028]">
                    <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">verified_user</span>
                        Requisitos Legales
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="h-10 w-10 shrink-0 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 flex items-center justify-center">
                                <span className="material-symbols-outlined">cake</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-white">Edad Mínima</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Debes tener al menos 18 años para registrarte como operador en ANAC (o 16 con autorización).</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="h-10 w-10 shrink-0 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                                <span className="material-symbols-outlined">badge</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-white">Registro de VANT</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Es obligatorio registrar tu drone en el Casillero Aeronáutico Digital (CAD) de la ANAC.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="h-10 w-10 shrink-0 rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 flex items-center justify-center">
                                <span className="material-symbols-outlined">security</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-white">Seguro de Responsabilidad Civil</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Obligatorio para uso comercial y recreativo de drones de cierto peso según normativa.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 opacity-50">
                            <div className="h-10 w-10 shrink-0 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center">
                                <span className="material-symbols-outlined">medical_services</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-gray-400">Certificado Médico</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-500">Requerido para licencias de piloto a distancia (Clase IV o similar según categoría).</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-[#0d0a08] border-t border-gray-100 dark:border-[#393028] text-center">
                    <a href="https://www.argentina.gob.ar/anac" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                        Visitar web de ANAC
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default RequirementsModal;
