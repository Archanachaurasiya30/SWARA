import { Router } from "express";
import { AiError, chatReply, jsonReply } from "../services/gemini.js";
import { detectEmergency, emergencyFallbackReply } from "../utils/emergency.js";
import {
  CATEGORIES,
  URGENCIES,
  validateChat,
  validateReport,
  validateRecommendation,
} from "../utils/validate.js";
import { chatSystem, emergencyAddon, reportSystem, recommendationSystem, scenarioName } from "../prompts.js";

const router = Router();
const languageNames = { en: "English", hi: "Hindi (Devanagari script)", hinglish: "Hinglish (Hindi in English letters)" };

// Sends a clean error to the browser. Nothing from the user's text is logged.
function sendError(res, err) {
  if (err instanceof AiError) return res.status(err.status).json({ error: err.message, code: err.code });
  console.error("Unexpected error:", err.message);
  return res.status(500).json({ error: "Something went wrong. Please try again." });
}

const clip = (value, max) => String(value || "").trim().slice(0, max);

// ---- Feature 1: chat ----
router.post("/chat", async (req, res) => {
  const check = validateChat(req.body);
  if (!check.ok) return res.status(400).json({ error: check.error });

  const { messages } = check.value;
  const emergency = detectEmergency(messages[messages.length - 1].text);

  try {
    const reply = await chatReply(chatSystem + (emergency ? emergencyAddon : ""), messages);
    res.json({ reply, emergency });
  } catch (err) {
    // In an emergency, always give safe guidance even if the AI service is down.
    if (emergency) return res.json({ reply: emergencyFallbackReply, emergency: true, degraded: true });
    sendError(res, err);
  }
});

// ---- Feature 2: crime report suggestions (never submits anything) ----
router.post("/categorize-report", async (req, res) => {
  const check = validateReport(req.body);
  if (!check.ok) return res.status(400).json({ error: check.error });

  const { complaint } = check.value;
  const emergency = detectEmergency(complaint);

  try {
    const raw = await jsonReply(reportSystem, `Complaint written by the user:\n"""\n${complaint}\n"""`);

    // Only accept values from our own lists. Anything else becomes a safe default.
    const category = CATEGORIES.includes(raw.category) ? raw.category : "Other";
    let urgency = URGENCIES.includes(raw.urgency) ? raw.urgency : "Medium";
    const immediateDanger = raw.immediateDanger === true || emergency;
    if (immediateDanger) urgency = "Immediate Attention";

    res.json({
      category,
      summary: clip(raw.summary, 600),
      keywords: Array.isArray(raw.keywords) ? raw.keywords.slice(0, 6).map((k) => clip(k, 30)).filter(Boolean) : [],
      urgency,
      immediateDanger,
    });
  } catch (err) {
    sendError(res, err);
  }
});

// ---- Feature 3: safety recommendations (only the topic and language are sent) ----
router.post("/recommendations", async (req, res) => {
  const check = validateRecommendation(req.body);
  if (!check.ok) return res.status(400).json({ error: check.error });

  const { scenario, language } = check.value;
  try {
    const raw = await jsonReply(
      recommendationSystem,
      `Situation: ${scenarioName(scenario)}\nWrite in: ${languageNames[language]}`
    );
    const recommendations = (Array.isArray(raw.recommendations) ? raw.recommendations : [])
      .slice(0, 8)
      .map((r) => ({ title: clip(r?.title, 60), advice: clip(r?.advice, 400) }))
      .filter((r) => r.title && r.advice);
    if (recommendations.length === 0) throw new AiError(502, "bad_json", "The AI answer was empty. Please try again.");

    res.json({
      summary: clip(raw.summary, 300),
      recommendations,
      emergencyNote: clip(raw.emergencyNote, 300),
    });
  } catch (err) {
    sendError(res, err);
  }
});

export default router;
