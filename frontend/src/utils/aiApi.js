// Talks to the SWARA AI server (ai-backend). The browser never sees the Gemini API key.
const BASE = (import.meta.env.VITE_AI_API_URL || "http://localhost:5002").replace(/\/$/, "");

async function post(path, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch(`${BASE}/api/ai${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || "The AI assistant could not answer right now. Please try again.");
    }
    return data;
  } catch (err) {
    if (err.name === "AbortError") throw new Error("The AI assistant took too long. Please try again.");
    if (err instanceof TypeError) {
      throw new Error("The AI assistant is not reachable right now. Check that the AI server is running.");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

// messages: [{ role: "user" | "assistant", text }]
export const sendChat = (messages) => post("/chat", { messages, consent: true });

export const categorizeReport = (complaint) => post("/categorize-report", { complaint, consent: true });

export const getRecommendations = (scenario, language) => post("/recommendations", { scenario, language });
