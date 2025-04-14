import React from 'react';

const topics = [
    { name: 'Anxiety', count: 324 },
    { name: 'Depression', count: 218 },
    { name: 'Stress', count: 176 },
    { name: 'Relationships', count: 142 },
    { name: 'Work-Life Balance', count: 98 },
];

const TopicList = ({ onSelectTopic, selectedTopic }) => {
    return (
        <div className="topic-list">
            <h2 className="text-lg font-bold mb-4">Topics</h2>
            <ul>
                {topics.map((topic) => (
                    <li
                        key={topic.name}
                        className={`cursor-pointer hover:bg-gray-200 p-2 rounded ${
                            selectedTopic === topic.name ? 'bg-purple-200 font-bold' : ''
                        }`}
                        onClick={() => onSelectTopic(topic.name)}
                    >
                        {topic.name} ({topic.count})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TopicList;