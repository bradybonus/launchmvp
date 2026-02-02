"use client";

import { useState, useRef, useEffect } from "react";

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

interface ImproveWithAIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentContent: string;
  onApplySuggestion: (text: string) => void;
}

const SIMULATED_RESPONSE_PREFIX = "Based on your direction, here’s a refined version:\n\n";

export function ImproveWithAIPanel({
  isOpen,
  onClose,
  currentContent,
  onApplySuggestion,
}: ImproveWithAIPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setIsThinking(true);
    setTimeout(() => {
      const suggestion =
        SIMULATED_RESPONSE_PREFIX +
        currentContent +
        "\n\n[Refined: " +
        trimmed +
        " — apply this direction to the content above.]";
      setMessages((prev) => [...prev, { role: "assistant", text: suggestion }]);
      setIsThinking(false);
    }, 1000);
  }

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-md flex-col bg-white shadow-xl sm:w-[28rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h3 className="text-lg font-semibold text-gray-900">Improve with AI</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="border-b border-gray-100 px-4 py-2 text-sm text-gray-500">
          Suggest direction or improvements. Launch AI will refine the content based on your prompts.
        </p>
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {messages.length === 0 && (
            <p className="text-sm text-gray-400">
              Example: “Make the tone more concise” or “Add a bullet list of benefits.”
            </p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`mb-3 rounded-lg px-3 py-2 ${
                m.role === "user"
                  ? "ml-8 bg-blue-600 text-white"
                  : "mr-8 bg-gray-100 text-gray-800"
              }`}
            >
              <p className="whitespace-pre-wrap text-sm">{m.text}</p>
            </div>
          ))}
          {isThinking && (
            <div className="mb-3 mr-8 rounded-lg bg-gray-100 px-3 py-2">
              <span className="text-sm text-gray-500">Thinking…</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Suggest direction or improvement..."
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isThinking}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || isThinking}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Send
            </button>
          </div>
          {lastAssistant && (
            <button
              type="button"
              onClick={() => onApplySuggestion(lastAssistant.text)}
              className="mt-3 w-full rounded-lg border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Apply latest suggestion to content
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
