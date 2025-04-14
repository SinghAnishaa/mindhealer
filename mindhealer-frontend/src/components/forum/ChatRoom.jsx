import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';

const ChatRoom = ({ topic }) => {
    const socket = useSocket();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!socket || !topic) return;

        console.log('Connecting to socket...');
        
        socket.emit('joinRoom', topic);
        console.log(`Joined room: ${topic}`);

        socket.on('message', (data) => {
            console.log('Received message:', data);
            setMessages(prev => [...prev, data]);
        });

        socket.on('userJoined', (data) => {
            console.log('User joined:', data);
            setMessages(prev => [...prev, { 
                userId: 'System', 
                message: `${data.userId} joined the chat` 
            }]);
        });

        return () => {
            socket.off('message');
            socket.off('userJoined');
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

        console.log('Sending message:', newMessage);
        socket.emit('message', { room: topic, message: newMessage });
        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto mb-4 space-y-3 p-4" style={{ maxHeight: "calc(100% - 80px)" }}>
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
                    className="bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition-colors disabled:opacity-50"
                    disabled={!newMessage.trim()}
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatRoom;