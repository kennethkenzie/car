"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, User, Bot, Sparkles, CarIcon } from "lucide-react";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  isVehicleInfo?: boolean;
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! Welcome to Car Baazar. How can I help you find your dream car today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input.toLowerCase();
    setInput("");
    setIsTyping(true);

    try {
      let botResponse = "";
      let isVehicleResponse = false;

      // Intent Detection
      if (currentInput.includes("hi") || currentInput.includes("hello") || currentInput.includes("hey")) {
        botResponse = "Hello there! 👋 Welcome to Car Baazar. I can help you browse our latest cars or provide our contact details. What's on your mind?";
      } else if (currentInput.includes("latest") || currentInput.includes("new stock") || currentInput.includes("any car") || currentInput.includes("show me")) {
        const res = await fetch("/api/vehicles/public");
        const vehicles = await res.json();
        if (Array.isArray(vehicles) && vehicles.length > 0) {
          const displayCount = 3;
          const selected = vehicles.slice(0, displayCount);
          botResponse = `Here are some of our latest premium vehicles:\n\n` + 
            selected.map(v => `• ${v.year} ${v.make} ${v.model} - UGX ${Number(v.price).toLocaleString()}`).join("\n") +
            `\n\nYou can view all ${vehicles.length} cars in our full inventory.`;
          isVehicleResponse = true;
        } else {
          botResponse = "We are currently updating our digital showroom. Please check back in a few minutes, or contact us directly!";
        }
      } else if (currentInput.includes("contact") || currentInput.includes("phone") || currentInput.includes("email")) {
        botResponse = "You can reach our sales team at carbazar77@gmail.com or visit our bond on Plot 12, Entebbe Road, Kampala. We're open 8 AM - 6 PM!";
      } else {
        botResponse = "I'm not sure I understand that. Would you like to see our latest inventory or get our contact details?";
      }

      // Mock delay for realism
      await new Promise(resolve => setTimeout(resolve, 1200));

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
        isVehicleInfo: isVehicleResponse
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
       setMessages((prev) => [...prev, {
         id: "error",
         text: "I'm having a bit of trouble connecting to our showroom right now. Please try again in a moment.",
         sender: "bot",
         timestamp: new Date()
       }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#0a0a0a] text-white shadow-2xl shadow-black/40 transition-all hover:scale-110 active:scale-95"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[380px] origin-bottom-right rounded-[2rem] bg-white border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-300 ease-out ${
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-0 opacity-0 translate-y-10"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-[#0a0a0a] p-6 rounded-t-[2rem]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Car Baazar AI</h3>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                <span className="text-[10px] font-medium text-white/70">Online & Ready</span>
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Message List */}
        <div
          ref={scrollRef}
          className="h-[400px] overflow-y-auto p-6 space-y-4 scroll-smooth"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  msg.sender === "user" ? "bg-gray-100 text-gray-500" : "bg-black/5 text-black"
                }`}
              >
                {msg.sender === "user" ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  msg.sender === "user"
                    ? "bg-[#0a0a0a] text-white rounded-br-none"
                    : "bg-gray-50 text-gray-800 border border-gray-100 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-end gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 text-black">
                <Bot size={14} />
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 text-sm flex gap-1 items-center">
                <div className="h-1 w-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="h-1 w-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="h-1 w-1 bg-gray-400 rounded-full animate-bounce" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-[2rem]">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-4 pr-14 text-sm text-gray-900 outline-none transition-all focus:border-black focus:ring-4 focus:ring-black/5"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#0a0a0a] text-white transition-opacity disabled:opacity-20 hover:scale-105 shadow-lg shadow-black/20"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-3 text-center text-[10px] font-medium text-gray-400">
            Typically replies instantly
          </p>
        </div>
      </div>
    </>
  );
}
