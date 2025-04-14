import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import TopicList from '../components/forum/TopicList';
import ChatRoom from '../components/forum/ChatRoom';
import PostSection from '../components/forum/PostSection';
import ChatLogo from '../components/forum/ChatLogo';
import { useSocket } from '../context/SocketContext';

const Forum = () => {
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [showChatroom, setShowChatroom] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [position, setPosition] = useState({ x: window.innerWidth - 420, y: window.innerHeight - 500 });
    const [onlineUsers, setOnlineUsers] = useState(0);
    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on('userCount', (count) => {
            setOnlineUsers(count);
        });

        return () => {
            socket.off('userCount');
        };
    }, [socket]);

    const handleDragStop = (e, d) => {
        setPosition({ x: d.x, y: d.y });
    };

    return (
        <div className="forum-page flex flex-col min-h-screen">
            {/* Online Users Section */}
            <div className="bg-purple-50 p-4 text-center">
                <span className="inline-flex items-center">
                    <span className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    <span className="text-purple-700 font-semibold">
                        {onlineUsers} {onlineUsers === 1 ? 'user' : 'users'} online
                    </span>
                </span>
            </div>

            <div className="flex flex-grow">
                {/* Sidebar for topics */}
                <div className="w-1/4 p-4 border-r">
                    <TopicList onSelectTopic={setSelectedTopic} selectedTopic={selectedTopic} />
                    <button
                        className="mt-4 w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
                        onClick={() => setShowChatroom(true)}
                    >
                        Chat with Someone Now
                    </button>
                </div>

                {/* Main content area */}
                <div className="w-3/4 p-4">
                    <PostSection />
                </div>
            </div>

            {/* Draggable Chatroom UI */}
            {showChatroom && (
                <Rnd
                    size={{ 
                        width: minimized ? 200 : 320,
                        height: minimized ? 60 : 400
                    }}
                    position={position}
                    onDragStop={handleDragStop}
                    bounds="window"
                    className={`bg-white shadow-xl rounded-lg overflow-hidden z-50 border border-purple-200 ${
                        minimized ? 'resize-none' : ''
                    }`}
                    enableResizing={!minimized}
                    dragHandleClassName="handle"
                >
                    <div className="flex flex-col h-full">
                        <div 
                            className="handle flex justify-between items-center p-3 bg-purple-500 cursor-move"
                        >
                            <div className="text-white font-semibold">
                                {selectedTopic ? `Chat: ${selectedTopic}` : 'Select a topic'}
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    className="text-white hover:text-purple-200 transition-colors"
                                    onClick={() => setMinimized(!minimized)}
                                >
                                    {minimized ? '🔼' : '🔽'}
                                </button>
                                <button
                                    className="text-white hover:text-purple-200 transition-colors"
                                    onClick={() => setShowChatroom(false)}
                                >
                                    ✖
                                </button>
                            </div>
                        </div>
                        {!minimized && (
                            <div className="flex-1 overflow-hidden">
                                {selectedTopic ? (
                                    <ChatRoom topic={selectedTopic} />
                                ) : (
                                    <div className="flex-1 p-4 flex items-center justify-center text-gray-500">
                                        Select a topic to start chatting
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </Rnd>
            )}
        </div>
    );
};

export default Forum;
