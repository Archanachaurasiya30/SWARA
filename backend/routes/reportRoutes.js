const express = require("express");
const mongoose = require("mongoose");
const Report = require("../models/Report");

const router = express.Router();

// Check MongoDB connection
const requireDb = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "Database is currently unavailable.",
    });
  }

  next();
};

// POST /api/reports - Save a new report
router.post("/", requireDb, async (req, res) => {
  try {
    const { name, crimeType, location, description } = req.body || {};

    if (
      typeof crimeType !== "string" ||
      typeof location !== "string" ||
      typeof description !== "string"
    ) {
      return res.status(400).json({
        message: "Invalid report details.",
      });
    }

    if (
      !crimeType.trim() ||
      !location.trim() ||
      description.trim().length < 10
    ) {
      return res.status(400).json({
        message: "Please provide valid report details.",
      });
    }

    if (
      (name !== undefined && typeof name !== "string") ||
      name?.length > 100 ||
      location.length > 300 ||
      description.length > 5000
    ) {
      return res.status(400).json({
        message: "One or more fields exceed the allowed limit.",
      });
    }

    const report = await Report.create({
      name: name && name.trim() ? name.trim() : "Anonymous",
      crimeType: crimeType.trim(),
      location: location.trim(),
      description: description.trim(),
    });

    res.status(201).json({
      message: "Report submitted",
      report: {
        _id: report._id,
        crimeType: report.crimeType,
        createdAt: report.createdAt,
      },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const first = Object.values(err.errors)[0];

      return res.status(400).json({
        message: first.message,
      });
    }

    console.error("Report submission failed:", err.message);

    res.status(500).json({
      message: "Something went wrong on the server.",
    });
  }
});

// GET /api/reports - Public access disabled
router.get("/", (req, res) => {
  res.status(403).json({
    message: "Access to submitted reports is restricted.",
  });
});

module.exports = router;