import { useState, useEffect } from "react";
import { Container } from "../components/ui/container";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { MessageSquare, PlusCircle, Trash2 } from "lucide-react";

const Forum = () => {
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem("forumPosts");
    return savedPosts ? JSON.parse(savedPosts) : [
      { id: 1, title: "Welcome to MindHealer Forum", description: "Feel free to share your thoughts and experiences.", author: "Admin" },
      { id: 2, title: "How do you handle stress?", description: "Share your best tips on managing stress effectively!", author: "User123" },
    ];
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    localStorage.setItem("forumPosts", JSON.stringify(posts));
  }, [posts]);

  const handleAddPost = () => {
    if (title.trim() && description.trim()) {
      const newPost = {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        author: "User", // Could be replaced with actual user name from context
        timestamp: new Date().toISOString(),
      };
      setPosts([newPost, ...posts]);
      setTitle("");
      setDescription("");
    }
  };

  const handleDelete = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  return (
    <Container className="py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
            <p className="text-gray-600 mt-2">Share your thoughts and connect with others</p>
          </div>
          <MessageSquare className="h-8 w-8 text-blue-600" />
        </div>

        {/* Create Post */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Create a New Post</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Post title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input w-full"
                />
              </div>
              <div>
                <textarea
                  placeholder="Share your thoughts..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input w-full min-h-[100px]"
                />
              </div>
              <Button
                onClick={handleAddPost}
                className="inline-flex items-center"
                disabled={!title.trim() || !description.trim()}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Post
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="animate-fade-in">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{post.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium text-gray-700">
                        Posted by {post.author}
                      </span>
                      {post.timestamp && (
                        <span className="ml-4">
                          {new Date(post.timestamp).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Forum;
