const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const Exam = require("../models/Exam");
const Result = require("../models/Result");

/* =========================
   CREATE EXAM
========================= */
router.post("/", auth, role("teacher", "admin"), async (req, res) => {
  try {
    if (req.body.examType === "TIMED") {
      if (!req.body.startTime || !req.body.endTime) {
        return res.status(400).json({
          message: "Start time and end time are required for timed exam",
        });
      }
    }

    const exam = await Exam.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json(exam);
  } catch {
    res.status(500).json({ message: "Error creating exam" });
  }
});

/* =========================
   GET ALL EXAMS (DYNAMIC STATUS)
========================= */
router.get("/", auth, async (req, res) => {
  try {
    const now = Date.now();
    const exams = await Exam.find().sort({ createdAt: -1 });

    let attemptedMap = {};

    if (req.user.role === "student") {
      const attempts = await Result.find({
        student: req.user.id,
        practice: false,
      }).select("exam");

      attempts.forEach(a => {
        attemptedMap[a.exam.toString()] = true;
      });
    }

    const examsWithStatus = exams.map(exam => {
      let status = "PRACTICE";

      if (exam.examType === "TIMED") {
        const start = exam.startTime && new Date(exam.startTime).getTime();
        const end = exam.endTime && new Date(exam.endTime).getTime();

        if (!start || now < start) status = "UPCOMING";
        else if (now > end) status = "ENDED";
        else status = "LIVE";
      }

      return {
        ...exam.toObject(),
        status,
        hasAttempted: attemptedMap[exam._id.toString()] || false,
      };
    });

    res.json(examsWithStatus);
  } catch {
    res.status(500).json({ message: "Error fetching exams" });
  }
});

/* ======================================================
   🔥 GET EXAM FOR EDIT (TEACHER / ADMIN ONLY)
====================================================== */
router.get(
  "/edit/:id",
  auth,
  role("teacher", "admin"),
  async (req, res) => {
    try {
      const exam = await Exam.findById(req.params.id);
      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }

      // 🔓 No time / attempt restriction
      res.json(exam);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to load exam for edit" });
    }
  }
);

/* =========================
   UPDATE EXAM (TEACHER / ADMIN)
========================= */
router.put(
  "/:id",
  auth,
  role("teacher", "admin"),
  async (req, res) => {
    try {
      const exam = await Exam.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }

      res.json(exam);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update exam" });
    }
  }
);

/* =========================
   DELETE EXAM (ADMIN ONLY)
========================= */
router.delete(
  "/:id",
  auth,
  role("admin"), // ✅ ONLY ADMIN
  async (req, res) => {
    try {
      const exam = await Exam.findByIdAndDelete(req.params.id);

      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }

      res.json({ message: "Exam deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete exam" });
    }
  }
);

/* =========================
   GET SINGLE EXAM (STUDENT VIEW – LOCKED)
========================= */
router.get("/:id", auth, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Teachers/Admins bypass locks
    if (req.user.role !== "student") {
      return res.json(exam);
    }

    const now = Date.now();

    if (exam.examType === "TIMED") {
      const start = exam.startTime && new Date(exam.startTime).getTime();
      const end = exam.endTime && new Date(exam.endTime).getTime();

      if (!start || now < start) {
        return res.status(403).json({ status: "UPCOMING" });
      }

      if (now > end) {
        return res.status(403).json({ status: "ENDED" });
      }

      const attempted = await Result.exists({
        student: req.user.id,
        exam: exam._id,
        practice: false,
      });

      if (attempted) {
        return res.status(403).json({
          status: "LOCKED",
          message: "You have already attempted this exam",
        });
      }
    }

    res.json(exam);
  } catch {
    res.status(500).json({ message: "Error fetching exam" });
  }
});/* =========================
   SUBMIT EXAM
========================= */
router.post("/:id/submit", auth, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const now = Date.now();

    /* ================= TIMED SECURITY ================= */
    if (exam.examType === "TIMED") {
      const start = new Date(exam.startTime).getTime();
      const end = new Date(exam.endTime).getTime();

      if (now < start)
        return res.status(403).json({ message: "Exam not started yet" });

      if (now > end)
        return res.status(403).json({ message: "Exam time is over" });

      const already = await Result.exists({
        student: req.user.id,
        exam: exam._id,
        practice: false,
      });

      if (already)
        return res.status(403).json({ message: "Exam already submitted" });
    }

    /* ================= ANSWERS VALIDATION ================= */
    if (!Array.isArray(req.body.answers)) {
      return res.status(400).json({ message: "Answers are required" });
    }

    let correctCount = 0;

    exam.questions.forEach((q, i) => {
      const ans = Number(req.body.answers[i]);
      if (!Number.isNaN(ans) && ans === q.correctAnswer - 1) {
        correctCount++;
      }
    });

    const marksPerQuestion = exam.marksPerQuestion || 1;
    const total = exam.questions.length * marksPerQuestion;
    const score = correctCount * marksPerQuestion;
    const percentage = total
      ? Math.round((score / total) * 100)
      : 0;

    const passingPercentage =
      typeof exam.passingPercentage === "number"
        ? exam.passingPercentage
        : 40;

    const status =
      percentage >= passingPercentage ? "PASS" : "FAIL";

    /* ================= PRACTICE = NO DB SAVE ================= */
    if (exam.examType === "PRACTICE") {
      return res.json({
        examTitle: exam.title,
        score,
        total,
        percentage,
        status,
        practice: true,
      });
    }

    /* ================= TIMED = DB SAVE ================= */
    await Result.create({
      student: req.user.id,
      exam: exam._id,
      score,
      total,
      percentage,
      status,
      practice: false,
    });

    res.json({
      examTitle: exam.title,
      score,
      total,
      percentage,
      status,
    });
  } catch (err) {
    console.error("SUBMIT EXAM ERROR:", err);
    res.status(500).json({ message: "Failed to submit exam" });
  }
});

module.exports = router;