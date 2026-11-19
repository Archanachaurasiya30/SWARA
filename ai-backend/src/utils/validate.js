// Basic input checks. Each function returns { ok: true, value } or { ok: false, error }.
export const LANGUAGES = ["en", "hi", "hinglish"];
export const SCENARIOS = [
  "travelling-alone",
  "public-transport",
  "home-safety",
  "online-safety",
  "workplace-safety",
  "emergency",
];
export const CATEGORIES = [
  "Harassment",
  "Stalking",
  "Cyber Harassment",
  "Domestic Violence",
  "Physical Harassment",
  "Threats",
  "Other",
];
export const URGENCIES = ["Low", "Medium", "High", "Immediate Attention"];

const MAX_MESSAGE = 1000;
const MAX_MESSAGES = 12;
const MAX_COMPLAINT = 3000;

export function validateChat(body) {
  if (!body || body.consent !== true) {
    return { ok: false, error: "Consent is required before messages are sent to the AI service." };
  }
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return { ok: false, error: "Send at least one message." };
  }
  const messages = body.messages
    .slice(-MAX_MESSAGES)
    .map((m) => ({
      role: m && m.role === "assistant" ? "assistant" : "user",
      text: String((m && m.text) || "").trim().slice(0, MAX_MESSAGE),
    }))
    .filter((m) => m.text);

  // Gemini expects the conversation to start with a user turn
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return { ok: false, error: "The last message must be from the user." };
  }
  return { ok: true, value: { messages } };
}

export function validateReport(body) {
  if (!body || body.consent !== true) {
    return { ok: false, error: "Consent is required before your complaint text is sent to the AI service." };
  }
  const complaint = String((body && body.complaint) || "").trim();
  if (complaint.length < 20) return { ok: false, error: "Please write a little more detail (at least 20 characters)." };
  if (complaint.length > MAX_COMPLAINT) return { ok: false, error: `Please keep the complaint under ${MAX_COMPLAINT} characters.` };
  return { ok: true, value: { complaint } };
}

export function validateRecommendation(body) {
  const scenario = body && body.scenario;
  const language = (body && body.language) || "en";
  if (!SCENARIOS.includes(scenario)) return { ok: false, error: "Choose one of the listed situations." };
  if (!LANGUAGES.includes(language)) return { ok: false, error: "Choose English, Hindi or Hinglish." };
  return { ok: true, value: { scenario, language } };
}
