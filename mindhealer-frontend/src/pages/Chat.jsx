// making new changes

import "../styles/Chat.css";
import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);
    const { user, authToken } = useContext(AuthContext);
    const navigate = useNavigate();

    // ✅ Enhanced auth check with localStorage fallback
    useEffect(() => {
        const checkAuth = () => {
            const token = authToken || localStorage.getItem("authToken");
            
            if (!token) {
                console.warn("❌ No authToken found! Redirecting...");
                navigate("/login");
                return false;
            }
            return true;
        };

        if (checkAuth()) {
            console.log("🔄 Fetching chat history...");
            fetchChatHistory();
        }
    }, [authToken, navigate]);

    // Fetch Chat History
    const fetchChatHistory = async () => {
        const token = authToken || localStorage.getItem("authToken");
        if (!token) return;

        try {
            const response = await fetch("http://localhost:5050/api/chatbot/history", {
                method: "GET",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 401) {
                console.warn("Session expired, redirecting to login");
                navigate("/login");
                return;
            }

            if (!response.ok) {
                console.error("Failed to fetch chat history:", response.status);
                return;
            }

            const data = await response.json();
            setMessages(data.messages || []);
        } catch (error) {
            console.error("Error fetching chat history:", error);
        }
    };

    // Handle Sending Messages
    const handleSendMessage = async () => {
        if (newMessage.trim() === "") return;

        const token = authToken || localStorage.getItem("authToken");
        if (!token) {
            navigate("/login");
            return;
        }

        const userMessage = { 
            id: Date.now(), 
            sender: "user", 
            text: newMessage, 
            time: new Date().toLocaleTimeString() 
        };
        
        setMessages(prev => [...prev, userMessage]);
        setNewMessage("");
        setIsTyping(true);

        try {
            const botResponse = await sendMessageToBackend(newMessage, token);
            
            if (botResponse === "You are not logged in!") {
                navigate("/login");
                return;
            }

            const botMessage = { 
                id: Date.now() + 1, 
                sender: "bot", 
                text: botResponse, 
                time: new Date().toLocaleTimeString() 
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsTyping(false);
        }
    };

    // Send Message to Backend
    const sendMessageToBackend = async (message, token) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chatbot/chat`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message })
            });

            if (response.status === 401) {
                navigate("/login");
                return "Session expired";
            }

            if (!response.ok) {
                return "Failed to send message. Please try again.";
            }

            const data = await response.json();
            return data.response || "I'm not sure how to respond.";
        } catch (error) {
            console.error("Network error:", error);
            return "Network issue, please try again.";
        }
    };

    // Auto-scroll to latest message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="chat-container">
            <h2 className="text-2xl font-bold text-blue-600 mb-3">💬 MindHealer Chat</h2>
            
            <div className="h-80 overflow-y-auto border p-3 rounded-lg bg-gray-100">
                {messages.length === 0 ? (
                    <p className="text-gray-500 italic">No messages yet.</p>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={msg.sender === "user" ? "user-message" : "bot-message"}>
                            <span className="text-xs font-light">{msg.time}</span>
                            {msg.text}
                        </div>
                    ))
                )}
                <div ref={chatEndRef} />
            </div>

            <div className="chat-input-container mt-3">
                <input
                    type="text"
                    className="w-full p-2 border rounded-lg text-gray-800"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={isTyping}
                />
                <button 
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    onClick={handleSendMessage}
                    disabled={isTyping}
                >
                    {isTyping ? "Sending..." : "Send"}
                </button>
            </div>
        </div>
    );
};

export default Chat;