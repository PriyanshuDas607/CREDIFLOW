import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm TrustBot. Ask me about your credit score or how to improve it.", sender: 'system' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const reply = await callGeminiAPI(userMsg.text);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, sender: 'system' }]);
        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now() + 1, text: "I'm having trouble connecting to the network right now. Please try again.", sender: 'system' }]);
        } finally {
            setIsTyping(false);
        }
    };

    const callGeminiAPI = async (prompt) => {
        // NOTE: In a real production app, never expose keys on the client.
        // Use a backend proxy. For this demo, we use a placeholder or assume local env.
        const API_KEY = ""; // USER: ENTER YOUR GEMINI API KEY HERE

        if (!API_KEY) {
            return mockGeminiResponse(prompt) + " (Note: Add your Gemini API Key in ChatWidget.jsx to get real AI responses)";
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `You are TrustBot, a helpful credit assistant for Indian gig workers. Answer briefly and professionally. User query: ${prompt}` }] }]
            })
        });

        const data = await response.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't understand that.";
    };

    const mockGeminiResponse = (query) => {
        const q = query.toLowerCase();
        if (q.includes('score') || q.includes('why')) {
            return "Your Trust Score is 785! It's calculated based on your timely loan repayments and consistent income.";
        } else if (q.includes('improve')) {
            return "To improve further, consider diversifying your credit mix or maintaining a low credit utilization ratio.";
        } else {
            return "I'm here to help with your credit and loans. Ask me about your score!";
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[500px] animate-in slide-in-from-bottom-10 fade-in duration-300">

                    {/* Header */}
                    <div className="p-4 bg-slate-50 border-b border-gray-100 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <Bot size={20} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-sm">TrustBot AI</h3>
                                <span className="flex items-center gap-1 text-xs text-green-600">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
                                </span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                    ? 'bg-primary text-white rounded-br-none'
                                    : 'bg-slate-100 text-gray-800 rounded-bl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-slate-100 p-3 rounded-2xl rounded-bl-none text-gray-400 text-sm">
                                    Thinking...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about your credit..."
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isTyping}
                                className="bg-primary text-white p-2 rounded-full hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} transition-all duration-300 bg-gradient-to-r from-secondary to-primary text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110`}
            >
                <MessageSquare size={28} />
            </button>
        </div>
    );
};

export default ChatWidget;
