import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { monthlyEquivalent } from "@/lib/format";
import { getCurrency } from "@/lib/currency";

const SUGGESTIONS = [
  "How do I add a subscription?",
  "Where can I cut spending?",
  "What renews soon?",
];

/** Floating in-app assistant: product guidance + subscription optimisation advice. */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { subs } = useSubscriptions();
  const scrollRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status } = useChat({ transport });
  const busy = status === "submitted" || status === "streaming";

  const context = useMemo(() => {
    if (subs.length === 0) return "The user has no subscriptions saved yet.";
    const currency = getCurrency();
    const monthly = subs
      .filter((sub) => sub.status !== "Cancelled")
      .reduce((sum, sub) => sum + monthlyEquivalent(sub.amount, sub.cycle), 0);
    const lines = subs.map(
      (sub) =>
        `- ${sub.name} | ${sub.category} | ${sub.amount} ${currency} ${sub.cycle} | renews ${sub.renewalDate} | ${sub.status}` +
        (sub.lastUsedDaysAgo !== undefined ? ` | last used ${sub.lastUsedDaysAgo} days ago` : ""),
    );
    return `Currency: ${currency}\nApprox. monthly total: ${Math.round(monthly)} ${currency}\nSubscriptions (${subs.length}):\n${lines.join("\n")}`;
  }, [subs]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = (text: string) => {
    if (!text.trim() || busy) return;
    setInput("");
    void sendMessage({ text: text.trim() }, { body: { context } });
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[min(560px,72vh)] w-[min(380px,calc(100vw-2rem))] animate-fade-up flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl md:right-6">
          <div className="flex items-center gap-3 border-b border-border/60 bg-primary/5 px-4 py-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <Bot className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-tight">SubTrack Assistant</p>
              <p className="text-xs text-muted-foreground">Guidance & savings tips</p>
            </div>
            <Button size="icon" variant="ghost" className="rounded-lg" onClick={() => setOpen(false)} aria-label="Close assistant">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Ask me anything about SubTrack, or how to trim your recurring spend.
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => send(suggestion)}
                      className="rounded-full border border-border/70 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => {
              const text = message.parts
                .map((part) => (part.type === "text" ? part.text : ""))
                .join("");
              if (!text) return null;
              return message.role === "user" ? (
                <div key={message.id} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground">
                    {text}
                  </div>
                </div>
              ) : (
                <div
                  key={message.id}
                  className="prose prose-sm max-w-none text-sm leading-relaxed text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-li:my-0.5 dark:prose-invert"
                >
                  <ReactMarkdown>{text}</ReactMarkdown>
                </div>
              );
            })}

            {status === "submitted" && (
              <p className="animate-pulse text-sm text-muted-foreground">Thinking…</p>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border/60 p-3"
          >
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about SubTrack or your spend…"
              className="rounded-xl"
            />
            <Button type="submit" size="icon" className="rounded-xl" disabled={busy || !input.trim()} aria-label="Send message">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}

      <Button
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-5 right-4 z-50 h-13 w-13 rounded-full p-0 shadow-xl transition hover:scale-105 md:right-6"
        aria-label={open ? "Close assistant" : "Open assistant"}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </Button>
    </>
  );
}
