// making critical chatbot fixes

// doing chatgpt changes

import "../styles/Chat.css";
import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getRandomQuote } from "../utils/quotes";
import ReactMarkdown from "react-markdown";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [quote, setQuote] = useState("");
    const chatEndRef = useRef(null);
    const { user, authToken } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        setQuote(getRandomQuote());
        const quoteInterval = setInterval(() => {
            setQuote(getRandomQuote());
        }, 10000);
        return () => clearInterval(quoteInterval);
    }, []);

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

    useEffect(() => {
        document.body.style.background = "url('/src/assets/chat-background.webp') no-repeat center center/cover";
        document.body.style.animation = "backgroundFade 10s infinite alternate ease-in-out";
    }, []);

    const fetchChatHistory = async () => {
        const token = authToken || localStorage.getItem("authToken");
        if (!token) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chatbot/history`, {
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
            console.log("API Response:", data);
            return data.response || "I'm not sure how to respond.";
        } catch (error) {
            console.error("Network error:", error);
            return "Network issue, please try again.";
        }
    };

    const handleSendMessage = async () => {
        const trimmedMessage = newMessage.trim(); // ✅ Trim input early
        if (!trimmedMessage) return; // ✅ Prevent empty messages
    
        const token = authToken || localStorage.getItem("authToken");
        if (!token) {
            navigate("/login");
            return;
        }
    
        const userMessage = { 
            id: Date.now(), 
            sender: "user", 
            text: trimmedMessage,  // ✅ Store only trimmed message
            time: new Date().toLocaleTimeString() 
        };
    
        setMessages(prev => [...prev, userMessage]);
        setNewMessage("");
        setIsTyping(true);
    
        try {
            const botResponse = await sendMessageToBackend(trimmedMessage, token);
            
            if (botResponse === "Session expired") {
                navigate("/login");
                return;
            }
    
            const trimmedBotResponse = botResponse?.trim(); // ✅ Ensure valid bot response
    
            if (!trimmedBotResponse) {
                console.warn("❌ Empty bot response, skipping update.");
                return;
            }
    
            const botMessage = { 
                id: Date.now() + 1, 
                sender: "bot", 
                text: trimmedBotResponse, // ✅ Store only trimmed response
                time: new Date().toLocaleTimeString() 
            };
    
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("❌ Error sending message:", error);
        } finally {
            setIsTyping(false);
        }
    };
    
    // ✅ Auto-scroll when messages update
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);    

    return (
        <div className="chat-layout">
            <div className="chat-box">
                <h2 className="chat-title">MindHealer Chat</h2>
                <div className="chat-messages">
                    {messages && messages.length > 0 ? (
                        messages
                            .filter(msg => msg.text && msg.text.trim() !== "") // ✅ Skip empty messages
                            .map((msg, index) => (
                                <div key={index} className={msg.sender === "user" ? "user-message" : "bot-message"}>
                                    <span className="message-time">{msg.time}</span>
                                    <ReactMarkdown>{msg.text}</ReactMarkdown> {/* ✅ Render Markdown */}
                                </div>
                            ))
                    ) : (
                        <p className="no-messages">Start a conversation to receive support.</p>
                    )}
                    <div ref={chatEndRef} style={{ display: "none" }} />
                </div>
                <div className="chat-input">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        disabled={isTyping}
                    />
                    <button onClick={handleSendMessage} disabled={isTyping}>
                        {isTyping ? "Sending..." : "Send"}
                    </button>
                </div>
            </div>

            <div className="quote-box">
                <h2>Mental Health Tip</h2>
                <p>{quote}</p>
            </div>
        </div>
    );
};

export default Chat;
