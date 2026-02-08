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
   DATABASE
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    /* =========================
       ROUTES
    ========================= */
    app.use("/api/auth", require("./routes/auth"));
    app.use("/api/exam", require("./routes/exam"));
    app.use("/api", require("./routes/result"));
    app.use("/api/messages", require("./routes/message"));

    /* =========================
       HEALTH CHECK (IMPORTANT)
    ========================= */
    app.get("/", (req, res) => {
      res.send("Backend running 🚀");
    });

    /* =========================
       SERVER (FIXED)
    ========================= */
    const PORT = process.env.PORT || 8080;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
