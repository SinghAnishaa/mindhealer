import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import TopicList from '../components/forum/TopicList';
import ChatRoom from '../components/forum/ChatRoom';
import PostSection from '../components/forum/PostSection';

const Forum = () => {
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [showChatroom, setShowChatroom] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [position, setPosition] = useState({ x: window.innerWidth - 520, y: window.innerHeight - 600 });

    const handleDragStop = (e, d) => {
        setPosition({ x: d.x, y: d.y });
    };

    return (
        <div className="forum-page flex flex-col min-h-screen">
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
                        width: minimized ? 250 : 400,
                        height: minimized ? 60 : 500
                    }}
                    position={position}
                    onDragStop={handleDragStop}
                    bounds="window"
                    className={`bg-white shadow-xl rounded-lg overflow-hidden z-50 border border-purple-200 ${
                        minimized ? 'resize-none' : ''
                    }`}
                    enableResizing={!minimized}
                    dragHandleClassName="handle"
                    minWidth={250}
                    minHeight={minimized ? 60 : 400}
                >
                    <div className="flex flex-col h-full">
                        <div 
                            className="handle flex justify-between items-center p-3 bg-gradient-to-r from-purple-900 to-purple-800 cursor-move"
                        >
                            <div className="text-white font-semibold flex items-center gap-2">
                                <span className="text-lg">💬 Live Chat: {selectedTopic || 'Select Topic'}</span>
                            </div>
                            <div className="flex items-center">
                                <button
                                    className="bg-purple-800 text-white w-8 h-8 flex items-center justify-center hover:bg-purple-700 transition-colors"
                                    onClick={() => setMinimized(!minimized)}
                                    title={minimized ? 'Maximize' : 'Minimize'}
                                >
                                    <span className="text-xl font-medium select-none leading-none" style={{ marginTop: '-2px' }}>
                                        {minimized ? '+' : '−'}
                                    </span>
                                </button>
                                <button
                                    className="bg-purple-800 text-white w-8 h-8 flex items-center justify-center hover:bg-purple-700 transition-colors ml-1"
                                    onClick={() => setShowChatroom(false)}
                                    title="Close"
                                >
                                    <span className="text-xl font-medium select-none leading-none" style={{ marginTop: '-2px' }}>
                                        ×
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className={`flex-1 overflow-hidden ${minimized ? 'hidden' : ''}`}>
                            {selectedTopic ? (
                                <ChatRoom topic={selectedTopic} />
                            ) : (
                                <div className="flex-1 p-4 flex items-center justify-center text-gray-500">
                                    Select a topic to start chatting
                                </div>
                            )}
                        </div>
                    </div>
                </Rnd>
            )}
        </div>
    );
};

export default Forum;
