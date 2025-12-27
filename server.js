const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

const router = express.Router();

/**
 * CREATE USER
 */
router.post("/create-user", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      role
    });

    await user.save();
    res.json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * LOGIN
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      username: user.username
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * TEST ROUTE
 */
const auth = require("../middleware/auth");

router.get(
  "/test-dentist",
  auth(["dentist"]),
  (req, res) => {
    res.json({
      message: "Dentist access granted",
      user: req.user
    });
  }
);

module.exports = router;
