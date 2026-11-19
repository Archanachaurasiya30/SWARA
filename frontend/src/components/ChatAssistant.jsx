import { useEffect, useRef, useState } from "react";
import { Bot, Send, Mic, X, Trash2, Phone, ShieldCheck, Sparkles, Loader2 } from "lucide-react";
import EmergencyAlert from "./EmergencyAlert";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import { sendChat } from "../utils/aiApi";
import { detectEmergency } from "../utils/emergency";
import { focusRing } from "../utils/ui";

const welcome = {
  id: "welcome",
  role: "assistant",
  welcome: true, // the welcome message is never sent to the AI
  text:
    "Hi, I am SWARA AI Assistant. Ask me about travel, home, workplace or online safety, or about helpline numbers. You can write in English, Hindi or Hinglish.\n\nIn an emergency, call 112 right away.",
};

const quickQuestions = [
  "I am travelling alone at night. What should I do?",
  "Which helpline should I call?",
  "Mujhe online harassment ho rahi hai, kya karu?",
];

let nextId = 1;

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  // Consent lasts only for this page visit. Nothing is saved in the browser.
  const [agreed, setAgreed] = useState(false);
  const [messages, setMessages] = useState([welcome]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [voiceLang, setVoiceLang] = useState("en-IN");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Recognised speech is put in the box. The person reads it, edits it and presses Send.
  const voice = useSpeechRecognition({
    onResult: (text) => setInput((prev) => (prev ? `${prev} ${text}` : text)),
  });

  // Keep the newest message in view
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages, loading, open]);

  // Focus the box when the chat opens, close with Escape
  useEffect(() => {
    if (!open) return;
    if (agreed) inputRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, agreed]);

  const send = async (text) => {
    const clean = text.trim();
    if (!clean || loading) return;
    voice.stop();
    setError("");
    setInput("");

    // The emergency banner is decided here, so it shows instantly and never waits for the AI
    const userMsg = { id: nextId++, role: "user", text: clean, emergency: detectEmergency(clean) };
    const history = [...messages, userMsg];
    setMessages(history);
    setLoading(true);

    try {
      const data = await sendChat(
        history.filter((m) => !m.welcome && !m.isError).map((m) => ({ role: m.role, text: m.text }))
      );
      setMessages((prev) => [
        ...prev,
        { id: nextId++, role: "assistant", text: data.reply, emergency: Boolean(data.emergency) },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([welcome]);
    setError("");
    setInput("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    send(input);
  };

  // Enter sends, Shift+Enter makes a new line
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const toggleMic = () => (voice.listening ? voice.stop() : voice.start(voiceLang));

  const onlyWelcome = messages.length === 1;

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open SWARA AI Assistant"
          className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-linear-to-br from-berry to-rose py-3.5 pl-4 pr-5 font-bold text-white shadow-xl shadow-berry/40 transition duration-300 motion-safe:hover:-translate-y-1 hover:shadow-2xl sm:bottom-6 sm:right-6 ${focusRing}`}
        >
          <Bot size={24} aria-hidden="true" />
          <span className="hidden sm:inline">Ask SWARA AI</span>
        </button>
      )}

      {/* Chat window */}
      {open && (
        <section
          role="dialog"
          aria-label="SWARA AI Assistant"
          className="animate-fade-up fixed inset-x-3 bottom-3 top-20 z-50 flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-2xl shadow-berry/30 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:top-auto sm:h-[36rem] sm:max-h-[calc(100vh-3rem)] sm:w-[24rem]"
        >
          {/* Header */}
          <div className="flex items-center gap-3 bg-linear-to-r from-berry to-rose px-4 py-3 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Bot size={22} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display font-bold leading-tight">SWARA AI Assistant</p>
              <a
                href="tel:112"
                className="inline-flex items-center gap-1 rounded text-xs font-semibold text-white/90 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Phone size={12} aria-hidden="true" /> Emergency? Call 112
              </a>
            </div>
            {agreed && (
              <button
                type="button"
                onClick={clearChat}
                aria-label="Clear chat"
                title="Clear chat"
                className="rounded-lg p-2 transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Trash2 size={18} aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-lg p-2 transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          {!agreed ? (
            /* ---------- Consent screen ---------- */
            <div className="flex flex-1 flex-col justify-center overflow-y-auto p-6 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-lavender text-berry">
                <ShieldCheck size={28} aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-display text-lg font-bold text-ink">Before you chat</h2>
              <ul className="mt-3 space-y-2 text-left text-sm text-muted">
                <li>Your messages are sent to Google Gemini (an AI service) to write the answers.</li>
                <li>Please do not type your exact address, phone numbers or other personal details.</li>
                <li>SWARA does not save this chat. It disappears when you refresh the page.</li>
                <li>The AI gives general safety guidance. It cannot call anyone or send an alert for you.</li>
              </ul>
              <button
                type="button"
                onClick={() => setAgreed(true)}
                className={`mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-berry to-violet-600 px-5 py-3 font-bold text-white shadow-md shadow-berry/25 transition hover:shadow-lg ${focusRing}`}
              >
                <Sparkles size={18} aria-hidden="true" /> I understand, start chat
              </button>
            </div>
          ) : (
            <>
              {/* ---------- Messages ---------- */}
              <div className="flex-1 space-y-3 overflow-y-auto bg-mist px-4 py-4" aria-live="polite">
                {messages.map((m) => (
                  <div key={m.id} className={m.role === "user" ? "flex flex-col items-end" : "flex flex-col items-start"}>
                    <p
                      className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm ${
                        m.role === "user"
                          ? "rounded-br-md bg-linear-to-br from-berry to-violet-600 text-white"
                          : "rounded-bl-md border border-line bg-white text-ink"
                      }`}
                    >
                      {m.text}
                    </p>
                    {m.role === "user" && m.emergency && (
                      <div className="mt-2 w-full">
                        <EmergencyAlert compact onNavigate={() => setOpen(false)} />
                      </div>
                    )}
                  </div>
                ))}

                {onlyWelcome && (
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => send(q)}
                        className={`rounded-full border border-berry/30 bg-white px-3 py-1.5 text-left text-xs font-semibold text-berry transition hover:bg-lavender ${focusRing}`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {loading && (
                  <div className="flex items-start" role="status" aria-label="SWARA AI is typing">
                    <span className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-line bg-white px-4 py-3">
                      {[0, 150, 300].map((delay) => (
                        <span
                          key={delay}
                          className="h-2 w-2 rounded-full bg-berry/60 motion-safe:animate-bounce"
                          style={{ animationDelay: `${delay}ms` }}
                        />
                      ))}
                    </span>
                  </div>
                )}

                {error && (
                  <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-alert-dark">
                    {error}
                  </p>
                )}
                <div ref={bottomRef} />
              </div>

              {/* ---------- Input ---------- */}
              <form onSubmit={handleSubmit} className="border-t border-line bg-white p-3">
                {(voice.error || voice.listening) && (
                  <p
                    role={voice.error ? "alert" : "status"}
                    className={`mb-2 rounded-lg px-3 py-2 text-xs ${
                      voice.error ? "bg-red-50 text-alert-dark" : "bg-lavender text-berry"
                    }`}
                  >
                    {voice.error ||
                      (voice.interim
                        ? `Listening: ${voice.interim}`
                        : "Listening... speak now. The text will appear below so you can check it.")}
                  </p>
                )}

                <div className="flex items-end gap-2">
                  <label htmlFor="chat-input" className="sr-only">
                    Type your safety question
                  </label>
                  <textarea
                    id="chat-input"
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    maxLength={1000}
                    placeholder="Type or speak your question..."
                    className={`max-h-28 min-h-[2.75rem] flex-1 resize-none rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-berry ${focusRing}`}
                  />

                  <button
                    type="button"
                    onClick={() => setVoiceLang(voiceLang === "en-IN" ? "hi-IN" : "en-IN")}
                    aria-label={`Voice language: ${voiceLang === "en-IN" ? "English" : "Hindi"}. Tap to change.`}
                    title="Voice language"
                    className={`h-11 rounded-xl border border-line px-2.5 text-xs font-bold text-berry transition hover:bg-lavender ${focusRing}`}
                  >
                    {voiceLang === "en-IN" ? "EN" : "हि"}
                  </button>

                  <button
                    type="button"
                    onClick={toggleMic}
                    aria-label={voice.listening ? "Stop listening" : "Speak your question"}
                    aria-pressed={voice.listening}
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${focusRing} ${
                      voice.listening
                        ? "border-alert bg-red-50 text-alert motion-safe:animate-pulse"
                        : "border-line text-berry hover:bg-lavender"
                    }`}
                  >
                    <Mic size={20} aria-hidden="true" />
                  </button>

                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    aria-label="Send message"
                    className={`flex h-11 w-11 items-center justify-center rounded-xl bg-berry text-white transition hover:bg-berry-dark disabled:opacity-50 ${focusRing}`}
                  >
                    {loading ? <Loader2 size={20} className="motion-safe:animate-spin" aria-hidden="true" /> : <Send size={20} aria-hidden="true" />}
                  </button>
                </div>

                <p className="mt-2 text-center text-[11px] text-muted">
                  AI can make mistakes. It gives general guidance only. Voice never sends anything on its own.
                </p>
              </form>
            </>
          )}
        </section>
      )}
    </>
  );
}
