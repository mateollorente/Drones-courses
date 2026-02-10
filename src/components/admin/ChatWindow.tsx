import React, { useRef, useEffect, useState } from 'react';
import { Message, User } from '../../utils/db';

interface ChatWindowProps {
    selectedEmail: string | null;
    messages: Message[];
    currentUser: User | null;
    onSend: (text: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedEmail, messages, currentUser, onSend }) => {
    const [reply, setReply] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to bottom only on mount or if new message added
        // Simple check: if last message changed, scroll.
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length, messages[messages.length - 1]?.id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim()) return;
        onSend(reply);
        setReply('');
    };

    if (!selectedEmail) {
        return (
            <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-[#393028] rounded-2xl overflow-hidden flex flex-col h-full items-center justify-center text-gray-400 p-8">
                <span className="material-symbols-outlined text-6xl mb-4 opacity-20">chat</span>
                <p>Selecciona una conversación para leer y responder.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-[#393028] rounded-2xl overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 dark:border-[#393028] bg-gray-50 dark:bg-[#1e1a16] flex justify-between items-center">
                <h2 className="font-bold dark:text-white">Chat con {selectedEmail}</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-[#0d0a08]">
                {messages.map(msg => {
                    const isMe = msg.fromEmail === currentUser?.email;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${isMe
                                ? 'bg-primary text-black rounded-tr-none'
                                : 'bg-white dark:bg-[#1e1a16] dark:text-gray-200 border border-gray-200 dark:border-[#393028] rounded-tl-none'
                                }`}>
                                <p>{msg.text}</p>
                                <span className={`text-[10px] block mt-1 ${isMe ? 'text-black/60' : 'text-gray-400'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-[#393028] bg-white dark:bg-[#1e1a16] flex gap-2">
                <input
                    type="text"
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    placeholder="Escribe una respuesta..."
                    className="flex-1 bg-gray-100 dark:bg-[#0d0a08] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary dark:text-white"
                />
                <button
                    type="submit"
                    disabled={!reply.trim()}
                    className="bg-primary hover:bg-[#ff9529] text-black font-bold p-3 rounded-xl transition-colors disabled:opacity-50"
                >
                    <span className="material-symbols-outlined">send</span>
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
