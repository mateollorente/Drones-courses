import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, Message } from '../utils/db'; // Correct path to db

const ChatWidget: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const adminEmail = 'admin@aerovision.com';

    // Load messages
    const loadMessages = async () => {
        if (!user) return;
        const chatHistory = await db.getMessages(user.email, adminEmail);
        setMessages(chatHistory);
        // Mark admin messages as read since we are viewing them
        await db.markMessagesAsRead(adminEmail, user.email);
    };

    useEffect(() => {
        loadMessages();
        // Poll for new messages every 1 second for better responsiveness
        const unsubscribe = db.subscribe(loadMessages);
        return () => unsubscribe();
    }, [user]);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !user) return;

        await db.sendMessage(user.email, adminEmail, input);
        setInput('');
        loadMessages(); // Refresh immediately
    };

    return (
        <div className="fixed bottom-20 right-4 w-80 md:w-96 bg-white dark:bg-[#1e1a16] border border-gray-200 dark:border-[#393028] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 z-50 h-[500px] max-h-[80vh]">
            {/* Header */}
            <div className="p-4 bg-primary text-black font-bold flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-black/10 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-lg">support_agent</span>
                    </div>
                    <span>Instructor de Vuelo</span>
                </div>
                <button onClick={onClose} className="hover:bg-black/10 p-1 rounded-full transition-colors">
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#0d0a08]">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 text-sm mt-10">
                        <p>¡Hola! Soy tu instructor.</p>
                        <p>Escríbeme si tienes dudas.</p>
                    </div>
                )}

                {messages.map(msg => {
                    const isUser = msg.fromEmail === user?.email;
                    return (
                        <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${isUser
                                ? 'bg-primary text-black rounded-tr-none'
                                : 'bg-white dark:bg-[#1e1a16] border border-gray-200 dark:border-[#393028] text-gray-700 dark:text-gray-300 rounded-tl-none'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-white dark:bg-[#1e1a16] border-t border-gray-200 dark:border-[#393028] flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Escribe tu duda..."
                    className="flex-1 bg-gray-100 dark:bg-[#0d0a08] border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary dark:text-white"
                />
                <button
                    type="submit"
                    disabled={!input.trim()}
                    className="bg-primary hover:bg-[#ff9529] text-black p-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="material-symbols-outlined">send</span>
                </button>
            </form>
        </div>
    );
};

export default ChatWidget;
