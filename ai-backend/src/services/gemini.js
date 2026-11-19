// The only file that talks to Google Gemini. To use another AI provider later,
// change this file and keep the same function names.
// The API key is read from the server environment (.env). It never goes to the browser.

export class AiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status; // HTTP status we send back to the browser
    this.code = code;
  }
}

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

// Safety-related topics (harassment, threats) can be wrongly blocked by default filters.
// We relax them so genuine safety questions still get answers.
const safetySettings = [
  "HARM_CATEGORY_HARASSMENT",
  "HARM_CATEGORY_HATE_SPEECH",
  "HARM_CATEGORY_SEXUALLY_EXPLICIT",
  "HARM_CATEGORY_DANGEROUS_CONTENT",
].map((category) => ({ category, threshold: "BLOCK_ONLY_HIGH" }));

async function callGemini({ system, contents, json = false, temperature = 0.5, maxOutputTokens = 800 }) {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "your_gemini_api_key_here") {
    throw new AiError(503, "not_configured", "The AI service is not set up yet.");
  }
  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);

  let res;
  try {
    res = await fetch(`${ENDPOINT}/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents,
        safetySettings,
        generationConfig: {
          temperature,
          maxOutputTokens,
          ...(json ? { responseMimeType: "application/json" } : {}),
        },
      }),
    });
  } catch (err) {
    if (err.name === "AbortError") throw new AiError(504, "timeout", "The AI service took too long to answer.");
    throw new AiError(502, "network", "Could not reach the AI service.");
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    // Log only the status code, never the user's text.
    console.error(`Gemini returned HTTP ${res.status}`);
    if (res.status === 429) throw new AiError(429, "busy", "The AI service is busy. Please try again in a minute.");
    if (res.status === 400 || res.status === 403) {
      throw new AiError(503, "config", "The AI service rejected the request. Check GEMINI_API_KEY and GEMINI_MODEL.");
    }
    throw new AiError(502, "upstream", "The AI service had a problem.");
  }

  const data = await res.json();
  const text = (data?.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("").trim();
  if (!text) throw new AiError(502, "empty", "The AI service returned no answer.");
  return text;
}

// Plain-text chat. "messages" are [{ role: "user" | "assistant", text }]
export async function chatReply(system, messages) {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.text }],
  }));
  return callGemini({ system, contents, temperature: 0.6, maxOutputTokens: 700 });
}

// Asks for JSON and parses it. Throws AiError if the answer is not valid JSON.
export async function jsonReply(system, userText) {
  const text = await callGemini({
    system,
    contents: [{ role: "user", parts: [{ text: userText }] }],
    json: true,
    temperature: 0.3,
    maxOutputTokens: 1000,
  });
  try {
    return JSON.parse(text.replace(/^```json|```$/g, "").trim());
  } catch {
    throw new AiError(502, "bad_json", "The AI answer could not be read. Please try again.");
  }
}
