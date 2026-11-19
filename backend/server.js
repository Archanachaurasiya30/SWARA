require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/swara";

app.use(cors());
app.use(express.json());

// Rate limit only report submissions (POST requests)
const reportSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method !== "POST",
  message: {
    message: "Too many report submissions. Please try again later.",
  },
});

app.get("/", (req, res) => {
  res.send("SWARA API running");
});

app.get("/api/health", (req, res) => {
  res.json({
    server: "ok",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Apply rate limiting before report routes
app.use("/api/reports", reportSubmissionLimiter);
app.use("/api/reports", require("./routes/reportRoutes"));

// Unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      message: "Invalid JSON in request body",
    });
  }

  console.error(err);
  res.status(500).json({
    message: "Something went wrong on the server.",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Connect MongoDB
mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    console.error(
      "Reports will not save until MongoDB is running. Check MONGO_URI in backend/.env"
    );
  });