import React from 'react';
import { Message } from '../../utils/db';

interface ConversationListProps {
    conversations: { userEmail: string; lastMessage: Message | null; unreadCount: number }[];
    selectedEmail: string | null;
    onSelect: (email: string) => void;
    onRefresh: () => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ conversations, selectedEmail, onSelect, onRefresh }) => {
    return (
        <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-[#393028] rounded-2xl overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 dark:border-[#393028] bg-gray-50 dark:bg-[#1e1a16] flex justify-between items-center">
                <h2 className="font-bold text-lg dark:text-white">Bandeja de Entrada</h2>
                <button onClick={onRefresh} className="text-primary hover:text-black transition-colors" title="Actualizar">
                    <span className="material-symbols-outlined">refresh</span>
                </button>
            </div>
            <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inbox</span>
                        <p>No hay mensajes aún.</p>
                        <p className="text-xs mt-2">Los mensajes de los alumnos aparecerán aquí.</p>
                    </div>
                ) : (
                    conversations.map(conv => (
                        <button
                            key={conv.userEmail}
                            onClick={() => onSelect(conv.userEmail)}
                            className={`w-full text-left p-4 border-b border-gray-100 dark:border-[#393028] hover:bg-gray-50 dark:hover:bg-[#2a2018] transition-colors ${selectedEmail === conv.userEmail ? 'bg-primary/10 border-l-4 border-l-primary' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-slate-800 dark:text-white truncate">{conv.userEmail}</span>
                                {conv.unreadCount > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{conv.unreadCount}</span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                {conv.lastMessage ? conv.lastMessage.text : <span className="italic opacity-50">Sin mensajes previos...</span>}
                            </p>
                            <span className="text-xs text-gray-400 mt-1 block">
                                {conv.lastMessage ? new Date(conv.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};

export default ConversationList;
