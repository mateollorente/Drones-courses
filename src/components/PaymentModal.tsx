import React, { useState } from 'react';

interface PaymentModalProps {
    courseTitle: string;
    price: string;
    onClose: () => void;
    onConfirm: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ courseTitle, price, onClose, onConfirm }) => {
    const [loading, setLoading] = useState(false);

    const handlePay = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            onConfirm();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1e1a16] w-full max-w-md rounded-2xl border border-gray-200 dark:border-[#393028] shadow-2xl p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                <div className="text-center mb-6">
                    <div className="h-12 w-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-2xl">credit_card</span>
                    </div>
                    <h2 className="text-2xl font-bold dark:text-white">Confirmar Compra</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Estás a punto de adquirir <br />
                        <span className="font-bold text-primary">{courseTitle}</span>
                    </p>
                </div>

                <form onSubmit={handlePay} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Número de Tarjeta</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">credit_card</span>
                            <input
                                type="text"
                                placeholder="0000 0000 0000 0000"
                                className="w-full bg-gray-50 dark:bg-[#0d0a08] border border-gray-200 dark:border-[#393028] rounded-lg py-2.5 pl-10 pr-4 font-mono text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fecha Exp.</label>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                className="w-full bg-gray-50 dark:bg-[#0d0a08] border border-gray-200 dark:border-[#393028] rounded-lg py-2.5 px-4 font-mono text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CVC</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-sm">lock</span>
                                <input
                                    type="text"
                                    placeholder="123"
                                    className="w-full bg-gray-50 dark:bg-[#0d0a08] border border-gray-200 dark:border-[#393028] rounded-lg py-2.5 pl-10 pr-4 font-mono text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:text-white"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-[#393028] flex justify-between items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Total a pagar:</span>
                        <span className="text-2xl font-black dark:text-white">{price}</span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-black font-bold py-3 rounded-xl shadow-lg hover:bg-[#ff9529] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                    >
                        {loading ? (
                            <>
                                <span className="material-symbols-outlined animate-spin">refresh</span>
                                Procesando...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">shopping_cart</span>
                                Pagar Ahora
                            </>
                        )}
                    </button>

                    <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-xs">lock</span>
                        Pago seguro con encriptación SSL de 256-bits
                    </p>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;
