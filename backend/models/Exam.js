const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    examType: {
      type: String,
      enum: ["TIMED", "PRACTICE"],
      default: "TIMED",
    },
    duration: Number,
    startTime: Date,
    endTime: Date,

    // 🔥 WATERMARK CONFIG
    watermark: {
      enabled: {
        type: Boolean,
        default: false,
      },
      text: {
        type: String,
        default: "",
      },
    },
passingPercentage: {
  type: Number,
  default: 40, // %
  min: 0,
  max: 100,
},


marksPerQuestion: {
  type: Number,
  default: 1,
},
    questions: [
      {
        question: String,
        options: [String],
        correctAnswer: Number,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);
