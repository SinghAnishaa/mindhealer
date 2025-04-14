import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostSection = () => {
    const [posts, setPosts] = useState([]); // Ensure posts is initialized as an empty array
    const [newPost, setNewPost] = useState('');

    useEffect(() => {
        // Fetch all posts globally
        axios.get('/api/forum/posts/global')
            .then((response) => {
                // Ensure the response is an array
                setPosts(Array.isArray(response.data) ? response.data : []);
            })
            .catch((error) => {
                console.error('Error fetching posts:', error);
                setPosts([]); // Fallback to an empty array on error
            });
    }, []);

    const handlePostSubmit = () => {
        if (newPost.trim() === '') return;

        // Add a new post globally
        axios.post('/api/forum/posts/global', { message: newPost })
            .then((response) => {
                setPosts((prevPosts) => [...prevPosts, response.data]);
                setNewPost('');
            })
            .catch((error) => console.error('Error adding post:', error));
    };

    return (
        <div className="post-section">
            <h2 className="text-lg font-bold mb-4">Posts</h2>
            <div className="posts bg-gray-100 p-4 rounded h-64 overflow-y-scroll mb-4">
                {posts.map((post) => (
                    <div key={post.id} className="post mb-2">
                        <strong>{post.userId}:</strong> {post.message}
                    </div>
                ))}
            </div>
            <div className="post-input flex">
                <input
                    type="text"
                    className="flex-grow border rounded p-2 mr-2"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Write a post..."
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handlePostSubmit}
                >
                    Post
                </button>
            </div>
        </div>
    );
};

export default PostSection;