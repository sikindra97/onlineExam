const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   DATABASE (FIRST)
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    /* =========================
       ROUTES (AFTER DB)
    ========================= */
    app.use("/api/auth", require("./routes/auth"));
    app.use("/api/exam", require("./routes/exam"));
    app.use("/api", require("./routes/result")); 
    // ↑ result routes: /api/results, /api/history etc

    /* ✅ CONTACT / ISSUE MESSAGES ROUTE */
    app.use("/api/messages", require("./routes/message"));

    /* =========================
       SERVER
    ========================= */
    app.listen(5000, () => {
      console.log("🚀 Server running on port 5000");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
