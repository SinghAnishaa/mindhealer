import "../styles/Chat.css";
import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";  
import { useNavigate } from "react-router-dom";  

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);
    const { user } = useContext(AuthContext);  // ✅ Get user data
    const navigate = useNavigate();

    // ✅ Fetch token safely (Changed "authToken" → "token")
    const getToken = () => {
        return localStorage.getItem("token") || null;
    };

    // ✅ Redirect if user is not authenticated
    useEffect(() => {
        const token = getToken();
        if (!token || !user) {
            console.warn("❌ No token or user found! Redirecting to login...");
            if (window.location.pathname !== "/login") {
                navigate("/login");
            }
        }
    }, [user, navigate]);

    // ✅ Handle expired token (redirect to login)
    const handleUnauthorized = () => {
        console.error("❌ Invalid or expired token! Logging out...");
        localStorage.removeItem("token");  
        navigate("/login"); 
    };

    // ✅ Fetch Chat History
    useEffect(() => {
        const fetchChatHistory = async () => {
            const token = getToken();
            if (!token) return; // Prevent fetch if token is missing
        
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chatbot/history`, {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (response.status === 401) {  
                    handleUnauthorized();
                    return;
                }

                const data = await response.json();
                if (!response.ok) {
                    console.error("Error fetching chat history:", data.error);
                    return;
                }

                // ✅ Format chat history
                const formattedMessages = data.messages.map((msg) => ({
                  id: msg.id || Date.now() + Math.random(),  // ✅ Unique ID assignment
                  sender: msg.role === "user" ? "user" : "bot",
                  text: msg.content,
                  time: new Date().toLocaleTimeString(),
                }));

                setMessages(formattedMessages);
            } catch (error) {
                console.error("❌ Network error while fetching chat history:", error);
            }
        };

        fetchChatHistory();
    }, []);  // ✅ Only fetch once on mount

    // ✅ Send Message Function
    // const sendMessageToBackend = async (message) => {
    //     const token = getToken();
    //     if (!token) {
    //         handleUnauthorized();
    //         return "You are not logged in!";
    //     }

    //     try {
    //         const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chatbot/chat`, {
    //             method: "POST",
    //             headers: {
    //                 "Authorization": `Bearer ${token}`, 
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify({ message })
    //         });

    //         if (response.status === 401) {  
    //             handleUnauthorized();
    //             return "Session expired. Please log in again.";
    //         }

    //         const data = await response.json();
    //         return data.response || "I'm not sure how to respond.";
    //     } catch (error) {
    //         console.error("❌ Network error:", error);
    //         return "Network issue, please try again.";
    //     }
    // };

    const sendMessageToBackend = async (message, retries = 3, delay = 2000) => {
      const token = getToken();
      if (!token) {
          handleUnauthorized();
          return "You are not logged in!";
      }
  
      for (let attempt = 0; attempt < retries; attempt++) {
          try {
              const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chatbot/chat`, {
                  method: "POST",
                  headers: {
                      "Authorization": `Bearer ${token}`, 
                      "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ message })
              });
  
              const data = await response.json();
              
              // Handle overloaded API case
              if (data.error && data.error_type === "overloaded") {
                  console.warn(`⚠️ Hugging Face API overloaded. Retrying in ${delay}ms...`);
                  await new Promise((resolve) => setTimeout(resolve, delay));
                  delay *= 2;
                  continue;
              }
  
              // ✅ Extract AI response and clean unnecessary prefixes (like "User: AI:")
              const aiResponse = data.generated_text
                  ? data.generated_text.replace(/User:.*\n|AI:\s?/g, "").trim()
                  : "I'm not sure how to respond.";
  
              return aiResponse;
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
  
      try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chatbot/chat`, {
              method: "POST",
              headers: {
                  "Authorization": `Bearer ${getToken()}`,
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({ message: newMessage })
          });
  
          const data = await response.json();
  
          if (!response.ok || data.error) {
              console.error("❌ Chatbot API Error:", data.error);
              return;
          }
  
          const botMessage = {
              id: Date.now() + 1,
              sender: "bot",
              text: data.response,  // ✅ Ensure the correct response is used
              time: new Date().toLocaleTimeString()
          };
  
          setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
          console.error("❌ Network Error:", error);
      }
  
      setIsTyping(false);
    };
  
    // const handleSendMessage = async () => {
    //     if (newMessage.trim() === "") return;

    //     setMessages((prevMessages) => [
    //         ...prevMessages,
    //         { id: Date.now() + Math.random(), sender: "user", text: newMessage, time: new Date().toLocaleTimeString() }
    //     ]);

    //     setNewMessage(""); 
    //     setIsTyping(true);

    //     const botResponse = await sendMessageToBackend(newMessage);
    //     setMessages((prevMessages) => [
    //         ...prevMessages,
    //         { id: Date.now() + Math.random(), sender: "bot", text: botResponse, time: new Date().toLocaleTimeString() }
    //     ]);

    //     setIsTyping(false);
    // };

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
