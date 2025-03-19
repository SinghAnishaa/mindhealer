import "../styles/Chat.css";
import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);
    const { user, authToken } = useContext(AuthContext); // Fixed: Use `authToken`
    const navigate = useNavigate();

    // ✅ Get Auth Token Safely
    const getAuthToken = () => {
        try {
            const storedToken = localStorage.getItem("authToken"); // Ensure consistent key usage
            if (!storedToken || storedToken === "undefined") {
                console.warn("No valid authToken found.");
                return null;
            }
            return storedToken;
        } catch (error) {
            console.error("Error accessing localStorage:", error);
            return null;
        }
    };

    // ✅ Ensure `authToken` exists before fetching chat history
    useEffect(() => {
        console.log("🔄 Checking user & authToken...");
        console.log("🔹 User:", user);
        console.log("🔹 authToken:", authToken);
    
        if (authToken === undefined || authToken === "") {
            console.warn("⚠️ Waiting for authToken to be set...");
            return; // Prevent premature redirect
        }
    
        if (!authToken) {
            console.warn("❌ No authToken found! Redirecting...");
            navigate("/login");
            return;
        }
    
        fetchChatHistory();
    }, [user, authToken, navigate]);
    
    // useEffect(() => {
    //     console.log("🔄 Checking user & authToken...");
    //     console.log("🔹 User:", user);
    //     console.log("🔹 authToken:", authToken);
    
    //     if (!authToken) {
    //         console.warn("❌ No authToken found! Redirecting...");
    //         navigate("/login");
    //         return;
    //     }
    
    //     fetchChatHistory();
    // }, [user, authToken, navigate]);

    // Fetch Chat History
    const fetchChatHistory = async () => {
        if (!authToken) return;

        try {
            const response = await fetch("http://localhost:5050/api/chatbot/history", {
                method: "GET",
                headers: { 
                    "Authorization": `Bearer ${authToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                console.error("Failed to fetch chat history:", response.status);
                return;
            }

            const data = await response.json();
            console.log("✅ Chat History Fetched:", data);
            setMessages(data.messages || []); // Ensure messages are set in state
        } catch (error) {
            console.error("Error fetching chat history:", error);
        }
    };

    // Handle Sending Messages
    const handleSendMessage = async () => {
        if (newMessage.trim() === "") return;

        const userMessage = { id: Date.now(), sender: "user", text: newMessage, time: new Date().toLocaleTimeString() };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        setNewMessage("");
        setIsTyping(true);

        const botResponse = await sendMessageToBackend(newMessage);
        if (botResponse === "You are not logged in!") {
            console.warn("User is not logged in, redirecting...");
            navigate("/login");
            return;
        }
        const botMessage = { id: Date.now() + 1, sender: "bot", text: botResponse, time: new Date().toLocaleTimeString() };

        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setIsTyping(false);
    };

    // Send Message to Backend
    const sendMessageToBackend = async (message) => {
        if (!authToken) {
            navigate("/login");
            return "You are not logged in!";
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chatbot/chat`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${authToken}`, // Fixed `authToken` usage
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                return "Failed to send message.";
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
    
            {messages.length === 0 ? (
                <p className="text-gray-500 italic">No messages yet.</p>  // Helps Debug Empty UI
            ) : (
                <div className="h-80 overflow-y-auto border p-3 rounded-lg bg-gray-100">
                    {messages.map((msg, index) => (
                        <div key={index} className={msg.sender === "user" ? "user-message" : "bot-message"}>
                            <span className="text-xs font-light">{msg.time}</span>
                            {msg.text}
                        </div>
                    ))}
                </div>
            )}
    
            {/* Ensure Input Box Appears */}
            <div className="chat-input-container">
                <input
                    type="text"
                    className="w-full p-2 border rounded-lg text-gray-800"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={handleSendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
