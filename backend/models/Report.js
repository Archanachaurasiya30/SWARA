const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "Anonymous" },
    crimeType: {
      type: String,
      required: [true, "Crime type is required"],
      enum: [
        "Harassment",
        "Stalking",
        "Domestic Violence",
        "Cyber Crime",
        "Other",
      ],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
