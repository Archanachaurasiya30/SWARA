import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import aiRouter from "./src/routes/ai.js";

const app = express();
app.disable("x-powered-by");

// Only these websites may call this server
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
app.use(cors({ origin: allowedOrigins, methods: ["POST", "GET"] }));

// Small request bodies only
app.use(express.json({ limit: "20kb" }));

// Basic rate limit: 20 AI requests per minute per visitor
app.use(
  "/api/ai",
  rateLimit({
    windowMs: 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests. Please wait a minute and try again." },
  })
);

app.get("/api/health", (req, res) => {
  // Tells the frontend whether the key is set, without revealing it
  res.json({ ok: true, aiConfigured: Boolean(process.env.GEMINI_API_KEY) && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here" });
});

app.use("/api/ai", aiRouter);

// Bad JSON or other errors
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") return res.status(400).json({ error: "Invalid request." });
  if (err.type === "entity.too.large") return res.status(413).json({ error: "Message is too long." });
  console.error("Server error:", err.message);
  res.status(500).json({ error: "Something went wrong." });
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`SWARA AI server running on http://localhost:${port}`);
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
    console.warn("GEMINI_API_KEY is not set. Copy .env.example to .env and add your key.");
  }
});
