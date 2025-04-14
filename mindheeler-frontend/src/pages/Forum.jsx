                        <div 
                            className="handle flex justify-between items-center p-3 bg-gradient-to-r from-purple-800 to-purple-900 cursor-move"
                        >
                            <div className="text-white font-semibold flex items-center gap-2">
                                <span>📱 Live Chat</span>
                            </div>
                            <div className="flex items-center">
                                <button
                                    className="bg-purple-700 text-white w-8 h-8 flex items-center justify-center hover:bg-purple-600 transition-colors"
                                    onClick={() => setMinimized(!minimized)}
                                    title={minimized ? 'Maximize' : 'Minimize'}
                                >
                                    <span className="text-xl font-medium select-none leading-none">{minimized ? '+' : '−'}</span>
                                </button>
                                <button
                                    className="bg-purple-700 text-white w-8 h-8 flex items-center justify-center hover:bg-purple-600 transition-colors ml-1"
                                    onClick={() => setShowChatroom(false)}
                                    title="Close"
                                >
                                    <span className="text-xl font-medium select-none leading-none">×</span>
                                </button>
                            </div>
                        </div>