import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';

const ChatRoom = ({ topic }) => {
    const socket = useSocket();
    const messagesEndRef = useRef(null);
    const [userCount, setUserCount] = useState(0);
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState(() => {
        // Try to load existing messages from sessionStorage
        const savedMessages = sessionStorage.getItem(`chat_messages_${topic}`);
        return savedMessages ? JSON.parse(savedMessages) : [];
    });

    // Save messages to sessionStorage whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            sessionStorage.setItem(`chat_messages_${topic}`, JSON.stringify(messages));
        }
    }, [messages, topic]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!socket || !topic) return;

        // Join the room
        socket.emit('joinRoom', topic);

        // Listen for room user count updates
        socket.on('roomUserCount', ({ count }) => {
            setUserCount(count);
        });

        // Listen for messages
        socket.on('message', (data) => {
            setMessages(prev => {
                const newMessages = [...prev, data];
                sessionStorage.setItem(`chat_messages_${topic}`, JSON.stringify(newMessages));
                return newMessages;
            });
        });

        // Listen for user joined events
        socket.on('userJoined', (data) => {
            setMessages(prev => {
                const newMessages = [...prev, { 
                    userId: 'System', 
                    message: `${data.userId} joined the chat` 
                }];
                sessionStorage.setItem(`chat_messages_${topic}`, JSON.stringify(newMessages));
                return newMessages;
            });
        });

        // Cleanup on unmount or topic change
        return () => {
            socket.emit('leaveRoom', topic);
            socket.off('message');
            socket.off('userJoined');
            socket.off('roomUserCount');
        };
    }, [socket, topic]);

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const sendMessage = () => {
        if (!socket || !newMessage.trim()) return;
        socket.emit('message', { room: topic, message: newMessage });
        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-full">
            {/* User count display */}
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border-b">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-purple-700 text-sm">
                    {userCount} {userCount === 1 ? 'user' : 'users'} in chat
                </span>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ height: "calc(100% - 120px)" }}>
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`max-w-[80%] px-4 py-2 rounded-lg ${
                            msg.userId === 'System' 
                                ? 'bg-gray-100 text-gray-600 text-center mx-auto text-sm'
                                : msg.userId === socket.userId
                                ? 'bg-purple-500 text-white ml-auto rounded-br-none'
                                : 'bg-gray-200 rounded-bl-none'
                        }`}
                    >
                        {msg.userId !== 'System' && (
                            <div className={`text-xs mb-1 ${
                                msg.userId === socket.userId ? 'text-purple-100' : 'text-gray-600'
                            }`}>
                                {msg.userId === socket.userId ? 'You' : msg.userId}
                            </div>
                        )}
                        {msg.message}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <form onSubmit={handleSubmit} className="flex gap-2 p-4 bg-gray-50 border-t">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <button 
                    type="submit" 
                    className="bg-purple-500 text-white px-6 py-2 rounded-full hover:bg-purple-600 transition-colors disabled:opacity-50"
                    disabled={!newMessage.trim()}
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatRoom;