// const router = require("express").Router();
// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const auth = require("../middleware/authMiddleware");
// const role = require("../middleware/roleMiddleware");

// // Register
// router.post("/register", async (req, res) => {
//   const { name, email, password, role: userRole } = req.body;

//   if (!password) {
//     return res.status(400).json({ message: "Password required" });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const user = await User.create({
//     name,
//     email,
//     password: hashedPassword,
//     role: userRole || "student",
//   });

//   const token = jwt.sign(
//     { id: user._id, role: user.role },
//     "SECRET123"
//   );

//   res.json({ token, user });
// });

// // Login
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });
//   if (!user) return res.status(400).json({ message: "User not found" });

//   const match = await bcrypt.compare(password, user.password);
//   if (!match) return res.status(400).json({ message: "Invalid credentials" });

//   const token = jwt.sign(
//     { id: user._id, role: user.role },
//     "SECRET123"
//   );

//   res.json({ token, user });
// });

// // ✅ CURRENT USER (THIS FIXES YOUR ERROR)
// router.get("/me", auth, async (req, res) => {
//   const user = await User.findById(req.user.id).select("-password");
//   res.json(user);
// });

// // Admin → get all users
// router.get("/users", auth, role("admin"), async (req, res) => {
//   const users = await User.find().select("-password");
//   res.json(users);
// });

// // Admin → delete user
// router.delete("/users/:id", auth, role("admin"), async (req, res) => {
//   await User.findByIdAndDelete(req.params.id);
//   res.json({ message: "User deleted" });
// });

// module.exports = router;
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

/* =========================
   REGISTER
========================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
    });

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   LOGIN
========================= */
router.post("/login", async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   CURRENT USER (FIXES AUTH BUG)
========================= */
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

/* =========================
   GET USERS (ADMIN)
========================= */
router.get("/users", auth, role("admin"), async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

/* =========================
   DELETE USER (ADMIN)
========================= */
router.delete("/users/:id", auth, role("admin"), async (req, res) => {
  if (req.user.id === req.params.id) {
    return res.status(400).json({ message: "Admin cannot delete himself" });
  }

  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted successfully" });
});

module.exports = router;
