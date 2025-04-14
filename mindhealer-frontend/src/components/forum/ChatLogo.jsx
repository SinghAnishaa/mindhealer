import React from 'react';

const ChatLogo = () => {
    return (
        <div className="flex items-center cursor-move">
            <div className="flex space-x-1">
                <div className="bg-orange-400 text-white px-3 py-1 rounded-full font-bold shadow-lg">
                    LIVE
                </div>
                <div className="bg-blue-400 text-white px-3 py-1 rounded-full font-bold shadow-lg">
                    CHAT
                </div>
            </div>
        </div>
    );
};

export default ChatLogo;