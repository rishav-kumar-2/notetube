const jwt = require("jsonwebtoken");

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const SECRET_KEY = process.env.JWT_SECRET;

// Generate JWT token — 7 days so users stay logged in comfortably
const generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });
};

// Verify JWT token — returns decoded payload or null, never throws
const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };