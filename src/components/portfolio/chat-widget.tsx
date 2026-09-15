"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, MessageCircle, RotateCcw } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GREETING: Message = {
  role: "assistant",
  content:
    "Hello. I am Imran's AI assistant, trained on his professional journey. Ask me anything about his roles, brands, skills, or how to reach him.",
};

const SUGGESTIONS = [
  "What is Imran's current role?",
  "Tell me about his Tira Beauty journey",
  "What are his core strengths?",
  "How can I contact Imran?",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [awaitingFirst, setAwaitingFirst] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streaming, scrollToBottom]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 350);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Esc closes the chat
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = useCallback(
    async (text?: string) => {
      const content = (text ?? input).trim();
      if (!content || streaming) return;

      const history = [...messages, { role: "user" as const, content }].filter(
        (m, i) => !(i === 0 && m.role === "assistant")
      );

      setInput("");
      setShowSuggestions(false);
      setMessages((prev) => [...prev, { role: "user", content }]);
      setStreaming(true);
      setAwaitingFirst(true);

      let reply = "";
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history.slice(-12) }),
        });

        const contentType = res.headers.get("content-type") ?? "";

        if (contentType.includes("text/plain") && res.body) {
          // Stream the reply token by token
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
          let first = true;
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            if (chunk) {
              if (first) {
                setAwaitingFirst(false);
                first = false;
              }
              reply += chunk;
              const snapshot = reply;
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = { role: "assistant", content: snapshot };
                return next;
              });
            }
          }
          if (reply.trim().length === 0) {
            setMessages((prev) => {
              const next = [...prev];
              next[next.length - 1] = {
                role: "assistant",
                content: "Please try again in a moment. I will be right here.",
              };
              return next;
            });
          }
        } else {
          // JSON fallback (rate limits, errors)
          const data = (await res.json()) as { reply?: string };
          setAwaitingFirst(false);
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: data.reply ?? "Please try again in a moment." },
          ]);
        }
      } catch {
        setAwaitingFirst(false);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "My connection dropped for a second. Please ask me again." },
        ]);
      } finally {
        setStreaming(false);
        setAwaitingFirst(false);
      }
    },
    [input, messages, streaming]
  );

  const reset = () => {
    if (streaming) return;
    setMessages([GREETING]);
    setShowSuggestions(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Floating launcher */}
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.5, type: "spring", bounce: 0.45 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className={`fixed z-[75] bottom-5 right-5 md:bottom-7 md:right-7 w-15 h-15 rounded-full bg-gradient-to-br from-[#e6cd8a] via-[#c9a24b] to-[#9a7a2e] flex items-center justify-center shadow-[0_16px_48px_-10px_rgba(201,162,75,0.65)] ${
          open ? "opacity-0 pointer-events-none" : "opacity-100"
        } transition-opacity`}
        aria-label={open ? "Close chat" : "Open chat with Imran's AI assistant"}
        aria-expanded={open}
      >
        {/* Pulse rings */}
        <span
          aria-hidden="true"
          className="chat-pulse-ring absolute inset-0 rounded-full border-2 border-[#c9a24b]/60"
        />
        <span
          aria-hidden="true"
          className="chat-pulse-ring absolute inset-0 rounded-full border border-[#e6cd8a]/50"
          style={{ animationDelay: "1.3s" }}
        />
        {/* Icon bundle */}
        <span className="chat-float relative flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-[#16120a]" strokeWidth={2.4} aria-hidden="true" />
          <Sparkles
            className="chat-sparkle absolute -top-2 -right-2.5 w-4.5 h-4.5 text-[#16120a] fill-[#16120a]/20"
            aria-hidden="true"
          />
        </span>
        {/* Notification dot */}
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -left-0.5 w-4 h-4 rounded-full bg-[#f2ecdf] border-2 border-[#c9a24b] flex items-center justify-center"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#9a7a2e]" />
        </span>
      </motion.button>

      {/* Close button (visible when open) */}
      <AnimatePresence>
        {open && (
          <motion.button
            type="button"
            onClick={() => setOpen(false)}
            initial={{ scale: 0, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 90 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.4 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed z-[95] bottom-5 right-5 md:bottom-7 md:right-7 w-15 h-15 rounded-full bg-[#121009] border border-[#c9a24b]/50 flex items-center justify-center shadow-[0_16px_48px_-10px_rgba(0,0,0,0.9)]"
            aria-label="Close chat"
          >
            <X className="w-5.5 h-5.5 text-gold-light" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="false"
            aria-label="Chat with Imran's AI assistant"
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed z-[90] bottom-24 right-4 md:right-7 w-[calc(100vw-2rem)] sm:w-[400px] h-[min(600px,calc(100dvh-8rem))] rounded-[1.75rem] border border-[#c9a24b]/30 bg-[#0c0a08]/98 backdrop-blur-2xl overflow-hidden flex flex-col shadow-[0_40px_120px_-24px_rgba(0,0,0,0.95)]"
          >
            {/* Header */}
            <div className="relative flex items-center gap-3.5 px-5 py-4 border-b border-border/80 bg-gradient-to-r from-[#14110a] to-[#100d08] flex-shrink-0">
              <div aria-hidden="true" className="absolute -top-10 -left-10 w-28 h-28 rounded-full bg-[#c9a24b]/10 blur-2xl" />
              <span className="relative w-11 h-11 rounded-xl border border-[#c9a24b]/50 bg-[#c9a24b]/12 flex items-center justify-center font-display font-bold text-gold-gradient text-sm">
                IM
              </span>
              <div className="relative min-w-0 flex-1">
                <p className="font-display font-semibold text-foreground leading-tight">
                  Imran&apos;s AI Assistant
                </p>
                <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                  <span className="relative flex w-2 h-2" aria-hidden="true">
                    <span className="absolute inline-flex w-full h-full rounded-full bg-[#c9a24b] opacity-60 chat-pulse-ring" />
                    <span className="relative inline-flex w-2 h-2 rounded-full bg-[#c9a24b]" />
                  </span>
                  Trained on Imran&apos;s profile
                </p>
              </div>
              <button
                type="button"
                onClick={reset}
                disabled={streaming}
                className="relative w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-gold-light hover:border-[#c9a24b]/50 transition-colors disabled:opacity-40"
                aria-label="Reset conversation"
                title="Reset conversation"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto nice-scroll px-4 py-5 space-y-4"
              aria-live="polite"
              aria-label="Conversation messages"
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <span
                      aria-hidden="true"
                      className="flex-shrink-0 w-8 h-8 rounded-lg border border-[#c9a24b]/40 bg-[#c9a24b]/10 flex items-center justify-center font-display text-[10px] font-bold text-gold-light mt-1 mr-2.5"
                    >
                      IM
                    </span>
                  )}
                  <div
                    className={`max-w-[82%] px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-2xl rounded-br-md bg-gradient-to-br from-[#c9a24b] to-[#a8862f] text-[#16120a] font-medium"
                        : "rounded-2xl rounded-bl-md border border-border bg-[#141109] text-[#ded6c2]"
                    }`}
                  >
                    {msg.role === "assistant" && streaming && i === messages.length - 1 && awaitingFirst ? (
                      // Waiting for the first token
                      <span className="flex items-center gap-1.5 py-1" role="status" aria-label="Assistant is typing">
                        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-[#c9a24b]" />
                        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-[#c9a24b]" />
                        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-[#c9a24b]" />
                      </span>
                    ) : (
                      <span
                        className={
                          msg.role === "assistant" && streaming && i === messages.length - 1
                            ? "stream-cursor whitespace-pre-wrap"
                            : "whitespace-pre-wrap"
                        }
                      >
                        {msg.content}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* Suggestion chips */}
              {showSuggestions && !streaming && (
                <div className="pt-2 space-y-2">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-bold px-1">
                    Try asking
                  </p>
                  <div className="grid gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="text-left rounded-xl border border-[#c9a24b]/25 bg-[#c9a24b]/[0.05] px-4 py-2.5 text-xs font-semibold text-[#d6cdb6] hover:border-[#c9a24b]/60 hover:bg-[#c9a24b]/10 hover:text-gold-light transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div className="flex-shrink-0 border-t border-border/80 bg-[#100d08] p-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex items-end gap-2.5"
              >
                <div className="flex-1 rounded-2xl border border-border bg-[#0c0a08] focus-within:border-[#c9a24b]/55 transition-colors">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      // Auto grow, cap at 4 rows
                      const el = e.target;
                      el.style.height = "auto";
                      el.style.height = `${Math.min(el.scrollHeight, 104)}px`;
                    }}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder="Ask about Imran's career..."
                    className="w-full bg-transparent resize-none px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none nice-scroll"
                    aria-label="Your message"
                    disabled={streaming}
                    maxLength={500}
                  />
                </div>
                <button
                  type="submit"
                  disabled={streaming || input.trim().length === 0}
                  className="gold-sweep flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-[#e6cd8a] via-[#c9a24b] to-[#a8862f] flex items-center justify-center text-[#16120a] disabled:opacity-35 disabled:cursor-not-allowed hover:shadow-[0_10px_28px_-8px_rgba(201,162,75,0.6)] transition-all"
                  aria-label="Send message"
                >
                  <Send className="w-4.5 h-4.5" strokeWidth={2.4} aria-hidden="true" />
                </button>
              </form>
              <p className="mt-2.5 px-1 text-[10px] text-muted-foreground/70 text-center">
                Answers reflect Imran&apos;s professional profile
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
