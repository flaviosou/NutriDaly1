import React, { useState, useEffect, useRef } from 'react';
import { Chat, User } from '../../types';
import Button from '../ui/Button';

interface ChatModalProps {
    chat: Chat;
    recipient: User;
    currentUser: User;
    onClose: () => void;
    onSendMessage: (text: string) => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ chat, recipient, currentUser, onClose, onSendMessage }) => {
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [chat.messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage('');
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-xl max-w-lg w-full h-[70vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-light-border dark:border-dark-border">
                    <div className="flex items-center gap-3">
                        <img src={recipient.avatarUrl} alt={recipient.name} className="w-10 h-10 rounded-full object-cover"/>
                        <h3 className="font-bold text-light-text dark:text-dark-text">{recipient.name}</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {chat.messages.map(msg => (
                        <div key={msg.id} className={`flex items-end gap-2 ${msg.senderId === currentUser.uid ? 'justify-end' : 'justify-start'}`}>
                            {msg.senderId !== currentUser.uid && (
                                <img src={recipient.avatarUrl} alt={recipient.name} className="w-6 h-6 rounded-full object-cover self-start"/>
                            )}
                            <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${msg.senderId === currentUser.uid ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 dark:bg-slate-700 text-light-text dark:text-dark-text rounded-bl-none'}`}>
                                <p className="text-sm">{msg.text}</p>
                                <p className={`text-xs mt-1 opacity-70 ${msg.senderId === currentUser.uid ? 'text-right' : 'text-left'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            {msg.senderId === currentUser.uid && (
                                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-6 h-6 rounded-full object-cover self-start"/>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-light-border dark:border-dark-border">
                    <form onSubmit={handleSend} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Digite uma mensagem..."
                            className="flex-1 block w-full rounded-md border-0 py-1.5 bg-gray-100 dark:bg-slate-700 text-light-text dark:text-dark-text shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-dark-border placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                        />
                        <Button type="submit" className="w-auto !p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatModal;