"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import type { Message } from "@/app/api/chat/route";

const QUICK_QUESTIONS = [
  "What is an I-94 and how do I get mine?",
  "What does 'priority date' mean?",
  "What is premium processing?",
  "What happens if I get an RFE?",
];

export default function FormExplainer() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    setMessages([...next, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) throw new Error();
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMessages((prev) => {
          const u = [...prev];
          u[u.length - 1] = { role: "assistant", content: acc };
          return u;
        });
      }
    } catch {
      setMessages((prev) => {
        const u = [...prev];
        u[u.length - 1] = { role: "assistant", content: "Something went wrong. Please try again." };
        return u;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-5 z-50">
      {/* Chat panel */}
      {open && (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl border border-border bg-card shadow-2xl shadow-black/20 flex flex-col" style={{ maxHeight: "480px" }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">?</div>
              <span className="text-sm font-semibold">Form Field Explainer</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3" style={{ minHeight: 0 }}>
            {messages.length === 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground text-center py-2">Ask anything about form fields, terms, or processes</p>
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="w-full text-left text-xs p-2.5 rounded-lg border border-border hover:border-primary/40 hover:bg-accent/30 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                    {m.role === "assistant" ? (
                      <div className="prose prose-xs dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1">
                        <ReactMarkdown>{m.content || (loading && i === messages.length - 1 ? "▌" : "")}</ReactMarkdown>
                      </div>
                    ) : m.content}
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-border p-3">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                placeholder="Ask about a form field..."
                className="resize-none text-xs min-h-[36px] max-h-[80px] border-border"
                rows={1}
                disabled={loading}
              />
              <Button size="sm" onClick={() => send(input)} disabled={!input.trim() || loading} className="h-9 w-9 p-0 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        className="ml-auto w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="Open form explainer"
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <span className="text-lg font-bold">?</span>
        )}
      </button>
    </div>
  );
}
