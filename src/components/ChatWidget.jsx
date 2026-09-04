"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";

const STORAGE_KEY = "portfolio-chat-history";
const MAX_MESSAGE_LENGTH = 1000;

const GREETING = {
  role: "assistant",
  content:
    "Hi! I'm Nikhil's portfolio assistant. Ask me about his projects, skills, experience, or how to get in touch.",
};

// The chat bubbles render plain text, but small local models don't reliably
// follow a "no markdown" instruction — Qwen3 still reaches for **bold**
// fairly often. Rather than depend on prompting, the literal markers are
// stripped from whatever comes back, so the bubble never shows raw asterisks.
function stripMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/(?<!\*)\*(?!\s|\*)(.+?)(?<!\s|\*)\*(?!\*)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/`([^`]+)`/g, "$1");
}

// The system prompt tells the model never to name what powers it, but a
// system prompt is a request, not a guarantee — a local model with no
// dedicated safety tuning (llama3, in this app's case) can still be talked
// into breaking character under an adversarial enough prompt. This is the
// actual backstop: whatever the model says, these terms never reach the
// screen, so a jailbreak attempt can win the model's cooperation without
// ever winning the disclosure it was after.
const IMPLEMENTATION_LEAK_PATTERN =
  /\b(ollama|open ?ai|chat ?gpt|gpt-?4o?|claude|anthropic|llama\s*-?\s*3|meta\s*ai|gemini|mistral|deepseek|qwen)\b/gi;

function redactImplementationDetails(text) {
  return text.replace(IMPLEMENTATION_LEAK_PATTERN, "this assistant");
}

/**
 * Reads the streamed /api/chat response and hands each text chunk to
 * `onChunk` as it arrives, so the message can grow on screen the way it's
 * being generated rather than appearing all at once at the end.
 */
async function streamChat(messages, onChunk, signal) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
    signal,
  });

  if (!response.ok || !response.body) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || "The assistant is currently unavailable.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value, { stream: true }));
  }
}

// Restored lazily, once, rather than in an effect: the messages list never
// reaches the DOM until the panel is opened (a client-only interaction), so
// reading sessionStorage here can't cause a server/client hydration mismatch
// — there's nothing on screen yet for the two renders to disagree about.
function restoreMessages() {
  if (typeof window === "undefined") return [GREETING];
  try {
    const saved = window.sessionStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : null;
    return Array.isArray(parsed) && parsed.length ? parsed : [GREETING];
  } catch {
    return [GREETING];
  }
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(restoreMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const listRef = useRef(null);
  const textareaRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Storage full or unavailable (private browsing) — history just won't
      // survive a refresh this time, which isn't worth surfacing to the user.
    }
  }, [messages]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) textareaRef.current?.focus();
  }, [isOpen]);

  // In-flight request is aborted on unmount so a closed tab never leaves a
  // stream running against nothing.
  useEffect(() => () => abortRef.current?.abort(), []);

  const canSend = input.trim().length > 0 && input.length <= MAX_MESSAGE_LENGTH && !isSending;

  async function handleSend() {
    const text = input.trim();
    if (!text || isSending) return;

    setError(null);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const userMessage = { role: "user", content: text };
    const nextMessages = [...messages, userMessage];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setIsSending(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      let full = "";
      await streamChat(
        nextMessages,
        (chunk) => {
          full += chunk;
          setMessages((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = {
              role: "assistant",
              content: redactImplementationDetails(stripMarkdown(full)),
            };
            return copy;
          });
        },
        controller.signal
      );

      // The model returned no text at all — an empty bubble reads as broken,
      // so this is treated the same as a failure.
      if (!full.trim()) {
        throw new Error("The assistant didn't return a response. Please try again.");
      }
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message || "Something went wrong. Please try again.");
      // Drop the empty assistant bubble that was reserved for the failed reply.
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsSending(false);
      abortRef.current = null;
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  function handleInput(event) {
    setInput(event.target.value);
    const el = event.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label={isOpen ? "Close chat" : "Chat about Nikhil"}
        aria-expanded={isOpen}
        className={`fixed bottom-5 right-5 z-[90] h-14 w-14 items-center justify-center rounded-full bg-accent text-surface shadow-xl shadow-accent/30 transition-colors hover:bg-accent-strong sm:bottom-6 sm:right-6 sm:flex ${
          // The panel is a full-screen sheet on mobile, so this button would
          // float on top of its composer there — the panel's own header
          // close button takes over instead. On sm+ the panel leaves room
          // above the button (bottom-24 vs. the panel's own bottom-6), so it
          // stays visible there and keeps doubling as the close control.
          isOpen ? "hidden" : "flex"
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? "close" : "chat"}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.15 }}
          >
            {isOpen ? <FiX size={24} /> : <FiMessageCircle size={24} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Chat with the portfolio assistant"
            className="fixed inset-0 z-[89] flex flex-col bg-surface sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[560px] sm:w-[380px] sm:rounded-2xl sm:border sm:border-line sm:shadow-2xl sm:shadow-graphite/20"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-line px-5 py-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-tint font-display text-xs font-bold text-accent">
                NR
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-bold text-ink">
                  Portfolio Assistant
                </p>
                <p className="flex items-center gap-1.5 text-xs text-muted">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>
                  Self-hosted AI · ask away
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-sunken hover:text-ink sm:hidden"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={listRef}
              data-lenis-prevent
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "rounded-br-sm bg-accent text-surface"
                        : "rounded-bl-sm bg-sunken text-ink"
                    }`}
                  >
                    {message.content || (
                      <span className="inline-flex gap-1 py-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" />
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {error && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                    {error}
                  </div>
                </div>
              )}
            </div>

            {/* Composer */}
            <div className="border-t border-line p-3">
              <div className="flex items-center gap-2 rounded-xl border border-line bg-ground px-3 py-2 focus-within:border-accent">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  maxLength={MAX_MESSAGE_LENGTH}
                  placeholder="Ask about a project, skill, or role..."
                  className="max-h-[120px] flex-1 resize-none bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!canSend}
                  aria-label="Send message"
                  className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-accent text-surface transition-colors enabled:hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FiSend size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
