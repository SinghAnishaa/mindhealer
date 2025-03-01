import React, { useState, useEffect, useRef } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Welcome to MindHealer Chat! How can I help you today?", time: new Date().toLocaleTimeString() },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Simulate bot response
  useEffect(() => {
    if (messages.length === 1) return; // Avoid initial bot message triggering a response

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.sender === "user") {
      setIsTyping(true);

      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: prevMessages.length + 1,
            sender: "bot",
            text: "Thank you for sharing! I'm here to listen.",
            time: new Date().toLocaleTimeString(),
          },
        ]);
        setIsTyping(false);
      }, 1000);
    }
  }, [messages]);

  // Auto-scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: prevMessages.length + 1,
        sender: "user",
        text: newMessage,
        time: new Date().toLocaleTimeString(),
      },
    ]);

    setNewMessage(""); // Clear input field after sending message
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-blue-600 text-white text-center p-10">
      <div className="bg-white text-gray-800 rounded-lg shadow-lg p-5 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-blue-600 mb-3">💬 MindHealer Chat</h2>
        <div className="h-80 overflow-y-auto border p-3 rounded-lg bg-gray-100 text-left">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 rounded-lg mb-2 ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}>
                <span className="text-xs font-light block">{msg.time}</span>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && <p className="text-sm italic text-gray-500">Bot is typing...</p>}
          <div ref={chatEndRef}></div>
        </div>

        {/* Chat Input */}
        <div className="flex mt-3">
          <input
            type="text"
            className="w-full p-2 border rounded-lg text-gray-800"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
