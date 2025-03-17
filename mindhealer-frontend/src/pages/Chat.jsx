import "../styles/Chat.css";
import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);
    const { user, token } = useContext(AuthContext); // ✅ Ensure Correct Token Name
    const navigate = useNavigate();

    // ✅ Get Access Token from LocalStorage
    const getToken = () => {
        const accessToken = localStorage.getItem("accessToken"); // ✅ Ensure Correct Key
        if (!accessToken || accessToken === "undefined") {
            console.error("❌ AccessToken is missing or invalid.");
            return null;
        }
        return accessToken;
    };

    // ✅ Redirect if user is not authenticated
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        console.log("Current token:", token); // Debug: check if token exists
        
        if (!token || token === "undefined") {
          console.warn("❌ No accessToken found! Redirecting to login...");
          navigate("/login");
          return;
        }
        
        fetchChatHistory(); // Only fetch if token exists
      }, [user, navigate]);

    // ✅ Fetch Chat History
   // In Chat.jsx, modify the fetchChatHistory function
const fetchChatHistory = async () => {
  const token = localStorage.getItem("accessToken");
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
      console.error("❌ Unauthorized: Token may be expired");
      navigate("/login");
      return;
    }
    
    if (!response.ok) {
      console.error("❌ Failed to fetch chat history:", response.status);
      return;
    }
    
    const data = await response.json();
    setMessages(data.messages || []);
  } catch (error) {
    console.error("❌ Network error while fetching chat history:", error);
  }
};

    useEffect(() => {
        fetchChatHistory();
    }, []);

    // ✅ Send Message to Backend
    const sendMessageToBackend = async (message) => {
        const accessToken = getToken();
        if (!accessToken) {
            navigate("/login");
            return "You are not logged in!";
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chatbot/chat`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
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
            console.error("❌ Network error:", error);
            return "Network issue, please try again.";
        }
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
