'use client';

import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../lib/api";

// Icons components
const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PhilosophyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 12C9 13.3807 7.88071 14.5 6.5 14.5C5.11929 14.5 4 13.3807 4 12C4 10.6193 5.11929 9.5 6.5 9.5C7.88071 9.5 9 10.6193 9 12Z" stroke="currentColor" strokeWidth="2" />
    <path d="M20 12C20 13.3807 18.8807 14.5 17.5 14.5C16.1193 14.5 15 13.3807 15 12C15 10.6193 16.1193 9.5 17.5 9.5C18.8807 9.5 20 10.6193 20 12Z" stroke="currentColor" strokeWidth="2" />
    <path d="M6.5 9.5C6.5 7 8.5 5 12 5C15.5 5 17.5 7 17.5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M6.5 14.5C6.5 17 8.5 19 12 19C15.5 19 17.5 17 17.5 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Typing indicator component
const TypingIndicator = () => (
  <div className="flex space-x-1 items-center py-4">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-indigo-400 rounded-full typing-indicator"></div>
      <div className="w-2 h-2 bg-indigo-400 rounded-full typing-indicator"></div>
      <div className="w-2 h-2 bg-indigo-400 rounded-full typing-indicator"></div>
    </div>
    <span className="text-sm text-slate-500 ml-2">Dostoevsky is thinking...</span>
  </div>
);

// Generate unique session ID
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string, content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session ID on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let storedSessionId = localStorage.getItem('chatbot_session_id');
      if (!storedSessionId) {
        storedSessionId = generateSessionId();
        localStorage.setItem('chatbot_session_id', storedSessionId);
      }
      setSessionId(storedSessionId);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, loading]);

  async function sendMessage() {
    if (!input.trim() || loading || !sessionId) return;

    const newEntry = { role: "user", content: input };
    setChatHistory([...chatHistory, newEntry]);
    setInput("");
    setLoading(true);

    try {
      const answer = await sendChatMessage(
        sessionId,
        input,
        chatHistory
      );

      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: answer }
      ]);
    } catch (error) {
      console.error("Failed to fetch response:", error);
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: "I apologize, but I'm having trouble connecting right now. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

      <div className="relative flex min-h-screen flex-col">
        {/* Header */}
        <header className="border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                <PhilosophyIcon />
              </div>
              <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Dostoevsky AI Philosopher
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Exploring existential questions through Dostoevsky's works
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Chat Area */}
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-xl overflow-hidden">
            {/* Chat Messages */}
            <div className="h-[600px] overflow-y-auto p-6 space-y-6">
              {chatHistory.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full">
                    <PhilosophyIcon />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                      Welcome to philosophical dialogue
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 max-w-md">
                      Ask me about suffering, freedom, faith, or any theme from Dostoevsky's most famous works!
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 max-w-md">
                    {[
                      "What does Ivan say about suffering?",
                      "Explain the Grand Inquisitor's argument",
                      "What is the role of faith and doubt?"
                    ].map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInput(question)}
                        className="text-xs px-3 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}>
                  <div className={`flex max-w-[80%] space-x-3 ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
                    }`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                      }`}>
                      {msg.role === "user" ? <UserIcon /> : <PhilosophyIcon />}
                    </div>
                    <div className={`px-4 py-3 rounded-2xl ${msg.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-md"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-md"
                      } shadow-sm`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start animate-fade-in-up">
                  <div className="flex max-w-[80%] space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center">
                      <PhilosophyIcon />
                    </div>
                    <div className="px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-tl-md shadow-sm">
                      <TypingIndicator />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-200/50 dark:border-slate-700/50 p-4 bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask about existence, suffering, freedom, or faith..."
                    disabled={loading}
                    rows={1}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none disabled:opacity-50 text-sm"
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <SendIcon />
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-4 text-xs text-slate-500 dark:text-slate-400">
          <p>Powered by AI • Inspired by Dostoevsky's philosophical depth</p>
        </footer>
      </div>
    </div>
  );
}
