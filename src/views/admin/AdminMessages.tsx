import React, { useState, useEffect } from 'react';
import { db, Message } from '../../utils/db';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ConversationList from '../../components/admin/ConversationList';
import ChatWindow from '../../components/admin/ChatWindow';
import Navbar from '../../components/Navbar';
import StudentDetails from '../../components/admin/StudentDetails';

const AdminMessages: React.FC = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<{ userEmail: string; lastMessage: Message | null; unreadCount: number }[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);

    const refreshConversations = () => {
        setConversations(db.getAllConversations());
    };

    const loadChat = (email: string) => {
        if (!user) return;
        setSelectedEmail(email);
        const chat = db.getMessages(user.email, email);
        setMessages(chat);
        db.markMessagesAsRead(email, user.email);
        refreshConversations();
    };

    useEffect(() => {
        refreshConversations();
        const interval = setInterval(() => {
            refreshConversations();
            if (selectedEmail && user) {
                // Fetch messages directly to ensure we get the latest
                const chat = db.getMessages(user.email, selectedEmail);
                // Only update state if length changed to avoid re-renders (simple check)
                setMessages(prev => {
                    if (prev.length !== chat.length) return chat;
                    // Deep check if needed, but length is usually enough for new messages
                    return chat;
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [selectedEmail, user]);

    const handleSend = (text: string) => {
        if (!selectedEmail || !user) return;
        db.sendMessage(user.email, selectedEmail, text);
        loadChat(selectedEmail);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            {/* Reuse Navbar for consistent admin experience */}
            {/* Ideally this should be in a shared AdminLayout, but importing Navbar here works for now */}
            <div className="flex-none">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                    <Link to="/admin" className="inline-flex items-center text-sm text-gray-500 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-lg mr-1">arrow_back</span>
                        Volver al Panel
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 lg:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-180px)] min-h-[600px]">
                    {/* Conversation List */}
                    <div className={`lg:col-span-1 h-full flex flex-col ${selectedEmail ? 'hidden lg:flex' : 'flex'}`}>
                        <ConversationList
                            conversations={conversations}
                            selectedEmail={selectedEmail}
                            onSelect={loadChat}
                            onRefresh={refreshConversations}
                        />
                    </div>

                    {/* Chat Window */}
                    <div className={`lg:col-span-2 h-full flex flex-col ${selectedEmail ? 'flex' : 'hidden lg:flex'}`}>
                        {selectedEmail && (
                            <button
                                onClick={() => setSelectedEmail(null)}
                                className="lg:hidden mb-4 flex items-center gap-2 text-gray-500 flex-none"
                            >
                                <span className="material-symbols-outlined">arrow_back</span> Atrás
                            </button>
                        )}
                        <div className="flex-1 min-h-0">
                            <ChatWindow
                                selectedEmail={selectedEmail}
                                messages={messages}
                                currentUser={user || null}
                                onSend={handleSend}
                            />
                        </div>
                    </div>

                    {/* Student Details */}
                    <div className="lg:col-span-1 h-full hidden xl:block overflow-y-auto">
                        {selectedEmail ? (
                            <StudentDetails email={selectedEmail} />
                        ) : (
                            <div className="h-full bg-gray-50 dark:bg-black/20 border-2 border-dashed border-gray-200 dark:border-[#393028] rounded-2xl flex items-center justify-center text-gray-400 p-8 text-center">
                                <div>
                                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">person_search</span>
                                    <p>Selecciona un alumno para ver sus detalles</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMessages;
