import "../styles/Chat.css";
import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);
    const { user, token, setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    // ✅ Get Token from LocalStorage
    //const getToken = () => localStorage.getItem("token") || null;
    const getToken = () => {
        const token = localStorage.getItem("token");
        if (!token || token === "undefined") {
            console.error("❌ Token is missing or invalid.");
            return null;
        }
        return token;
    };

    // ✅ Redirect if user is not authenticated
    useEffect(() => {
        if (!getToken() || !user) {
            console.warn("❌ No token or user found! Redirecting to login...");
            navigate("/login");
        }
    }, [user, navigate]);

    // ✅ Refresh Token Function
    const refreshAccessToken = async () => {
        try {
            console.log("🔄 Refreshing access token...");
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh-token`, {
                method: "POST",
                credentials: "include"
            });

            const data = await response.json();
            if (response.ok && data.accessToken) {
                console.log("✅ New Access Token:", data.accessToken);
                localStorage.setItem("token", data.accessToken);
                setToken(data.accessToken);
                return data.accessToken;
            } else {
                console.error("❌ Failed to refresh access token", data);
                navigate("/login"); // Redirect to login on failure
            }
        } catch (error) {
            console.error("❌ Error refreshing token:", error);
            navigate("/login");
        }
    };

    // ✅ Fetch Chat History (with Retry)
// ✅ Fetch Chat History (with Retry)
const fetchChatHistory = async () => {
    const token = getToken();

    
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chatbot/history`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });
    
            if (response.status === 401) {  
                console.warn("❌ Token expired. Attempting refresh...");
                const newToken = await refreshAccessToken();
    
                if (newToken) {
                    return fetchChatHistory(); // Retry with new token
                }
                return; // If refresh fails, exit
            }
    
            const data = await response.json();
            if (!response.ok) {
                console.error("Error fetching chat history:", data.error);
                return;
            }
    
            setMessages(data.messages);
        } catch (error) {
            console.error("❌ Network error while fetching chat history:", error);
        }
    };
    

    useEffect(() => {
        fetchChatHistory();
    }, []);

    // ✅ Send Message to Backend (with Retry)
    const sendMessageToBackend = async (message, retries = 2, delay = 2000) => {
        let token = getToken();
        if (!token) {
            navigate("/login");
            return "You are not logged in!";
        }

        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chatbot/chat`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ message })
                });

                if (response.status === 401 && attempt < retries) {
                    console.warn("⚠️ Token expired. Refreshing...");
                    token = await refreshAccessToken();
                    if (token) continue; // Retry with new token
                    return "Session expired. Please log in again.";
                }

                const data = await response.json();
                return data.response || "I'm not sure how to respond.";
            } catch (error) {
                console.error("❌ Network error:", error);
                return "Network issue, please try again.";
            }
        }

        return "Hugging Face API is currently overloaded. Try again later.";
    };

    // ✅ Handle Sending Messages
    const handleSendMessage = async () => {
        if (newMessage.trim() === "") return;

        const userMessage = { id: Date.now(), sender: "user", text: newMessage, time: new Date().toLocaleTimeString() };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        setNewMessage("");
        setIsTyping(true);

        const botResponse = await sendMessageToBackend(newMessage);
        const botMessage = { id: Date.now() + 1, sender: "bot", text: botResponse, time: new Date().toLocaleTimeString() };

        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setIsTyping(false);
    };

    // ✅ Auto-scroll to latest message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="chat-messages">
            <div className="bg-white text-gray-800 rounded-lg shadow-lg p-5 w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-blue-600 mb-3">💬 MindHealer Chat</h2>

                {/* Chat Messages */}
                <div className="h-80 overflow-y-auto border p-3 rounded-lg bg-gray-100 text-left">
                    {messages.map((msg, index) => (
                        <div key={msg.id || `message-${index}`} className={msg.sender === "user" ? "user-message" : "bot-message"}>
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
