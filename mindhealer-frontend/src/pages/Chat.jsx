import React, { useState, useEffect, useRef } from "react";
import { Container } from "../components/ui/container";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Send, Bot, Sparkles } from "lucide-react";
import { getRandomQuote } from "../utils/quotes";
import ReactMarkdown from 'react-markdown';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const [dailyQuote, setDailyQuote] = useState("");

    useEffect(() => {
        setDailyQuote(getRandomQuote());
        fetchChatHistory();
    }, []);

    const fetchChatHistory = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chatbot/history`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if (response.ok) {
                const data = await response.json();
                const formattedMessages = data.messages.map(msg => ({
                    text: msg.content,
                    sender: msg.role === "user" ? "user" : "bot",
                    timestamp: new Date()
                }));
                setMessages(formattedMessages);
            }
        } catch (error) {
            console.error("Failed to fetch chat history:", error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const userMessage = { text: newMessage, sender: "user", timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        setNewMessage("");
        setIsTyping(true);

        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chatbot/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ message: newMessage }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(prev => [...prev, {
                    text: data.response,
                    sender: "bot",
                    timestamp: new Date()
                }]);
            } else {
                throw new Error("Failed to get response");
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, {
                text: "I'm having trouble responding right now. Please try again later.",
                sender: "bot",
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="min-h-screen py-8">
            <Container>
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2 h-[70vh] flex flex-col">
                            <CardHeader className="border-b">
                                <CardTitle className="flex items-center">
                                    <Bot className="w-6 h-6 text-blue-600 mr-2" />
                                    AI Mental Health Assistant
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${
                                            message.sender === "user" ? "justify-end" : "justify-start"
                                        }`}
                                    >
                                        <div
                                            className={`max-w-[80%] p-3 rounded-lg ${
                                                message.sender === "user"
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-100 text-gray-800"
                                            }`}
                                        >
                                            {message.sender === "user" ? (
                                                <p className="text-sm">{message.text}</p>
                                            ) : (
                                                <div className="text-sm prose prose-sm max-w-none">
                                                    <ReactMarkdown>{message.text}</ReactMarkdown>
                                                </div>
                                            )}
                                            <span className="text-xs opacity-75 mt-1 block">
                                                {message.timestamp.toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                                            <p className="text-sm">AI is typing...</p>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </CardContent>
                            <div className="border-t p-4">
                                <form onSubmit={handleSendMessage} className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="input flex-1"
                                    />
                                    <Button type="submit" disabled={!newMessage.trim() || isTyping}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </Card>

                        <Card className="h-fit">
                            <CardHeader>
                                <CardTitle className="flex items-center text-lg">
                                    <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
                                    Daily Inspiration
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <blockquote className="italic text-gray-600">
                                    "{dailyQuote}"
                                </blockquote>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Chat;
