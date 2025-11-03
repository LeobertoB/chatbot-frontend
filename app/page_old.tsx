'use client';

import { useState } from "react";
import { sendChatMessage } from "../lib/api";

export default function Home() {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string, content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const newEntry = { role: "user", content: input };
    setChatHistory([...chatHistory, newEntry]);
    setLoading(true);

    try {
      const answer = await sendChatMessage(
        input,
        chatHistory
      );

      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: answer }
      ]);
    } catch (error) {
      console.error("Failed to fetch response:", error);
    } finally {
      setInput("");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-zinc-50 px-4 py-8 dark:bg-black">
      <div className="w-full max-w-2xl space-y-4">
        <h1 className="text-3xl font-semibold text-black dark:text-white text-center">
          Dostoevsky AI Philosopher
        </h1>

        <div className="h-[500px] overflow-y-auto rounded border border-zinc-300 dark:border-zinc-700 p-4 bg-white dark:bg-zinc-900">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
              <span
                className={`inline-block rounded px-3 py-2 text-sm ${msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white"
                  }`}
              >
                {msg.content}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 rounded border px-4 py-2 dark:bg-zinc-800 dark:text-white"
            placeholder="Ask a question about The Grand Inquisitor..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            className="rounded bg-black px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-50"
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}