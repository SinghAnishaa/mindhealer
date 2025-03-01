import { useState, useEffect } from "react";

const Forum = () => {
  // Load posts from Local Storage on first render
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem("forumPosts");
    return savedPosts ? JSON.parse(savedPosts) : [
      { id: 1, title: "Welcome to MindHealer Forum", description: "Feel free to share your thoughts and experiences.", author: "Admin" },
      { id: 2, title: "How do you handle stress?", description: "Share your best tips on managing stress effectively!", author: "User123" },
    ];
  });

  // Form state for new post
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Save posts to Local Storage whenever posts change
  useEffect(() => {
    localStorage.setItem("forumPosts", JSON.stringify(posts));
  }, [posts]);

  // Function to add a new post
  const handleAddPost = () => {
    if (title.trim() && description.trim()) {
      const newPost = {
        id: posts.length + 1,
        title,
        description,
        author: "Anonymous",
      };
      setPosts([newPost, ...posts]); // Add new post at the top
      setTitle(""); // Clear input fields
      setDescription("");
    }
  };

  // Function to delete a post
  const handleDelete = (id) => {
    const updatedPosts = posts.filter((post) => post.id !== id);
    setPosts(updatedPosts);
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">📝 Forum Discussions</h2>

      {/* New Post Form */}
      <div className="border p-4 rounded shadow-sm mb-5">
        <input
          type="text"
          placeholder="Enter post title"
          className="w-full p-2 mb-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Enter post description"
          className="w-full p-2 mb-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          onClick={handleAddPost}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Post
        </button>
      </div>

      {/* Forum Posts */}
      {posts.map((post) => (
        <div key={post.id} className="border rounded p-4 mb-3 shadow-sm">
          <h3 className="text-lg font-semibold text-blue-600">{post.title}</h3>
          <p>{post.description}</p>
          <p className="text-sm text-gray-500">Posted by {post.author}</p>
          <button
            onClick={() => handleDelete(post.id)}
            className="bg-red-500 text-white px-3 py-1 mt-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Forum;
