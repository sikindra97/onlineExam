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
<<<<<<< HEAD
   DATABASE
=======
   ROUTES
>>>>>>> 8bb14c0 (Updated exam system files)
========================= */

app.use("/api/auth", require("./routes/auth"));
app.use("/api/exam", require("./routes/exam"));
app.use("/api", require("./routes/result"));
app.use("/api/messages", require("./routes/message"));

/* QUESTION ROUTE */

app.use("/api/questions", require("./routes/question"));

/* SUBJECT ROUTE */

app.use("/api/subject", require("./routes/subject"));

/* =========================
   DATABASE
========================= */

mongoose
.connect(process.env.MONGO_URI)
.then(()=>{

<<<<<<< HEAD
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
=======
console.log("✅ MongoDB Connected");

app.listen(5000, ()=>{
console.log("🚀 Server running on port 5000");
});

})
.catch(err=>{
console.error("❌ MongoDB connection failed:", err.message);
});
>>>>>>> 8bb14c0 (Updated exam system files)
