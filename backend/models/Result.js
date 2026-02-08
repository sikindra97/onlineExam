const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    practice: {
      type: Boolean,
      default: false,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

/* 🔒 ABSOLUTE DATABASE LOCK (TIMED EXAM) */
resultSchema.index(
  { student: 1, exam: 1, practice: 1 },
  {
    unique: true,
    partialFilterExpression: { practice: false },
  }
);

module.exports = mongoose.model("Result", resultSchema);
