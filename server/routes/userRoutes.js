const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authcontroller");
const authenticate = require("../middleware/authmiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route
router.get("/dashboard", authenticate, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}` });
});

module.exports = router;