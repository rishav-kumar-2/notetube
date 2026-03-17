const express = require("express");
const cors    = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const { connectDB, sequelize } = require("./config/db");
const User        = require("./models/User");
const Video       = require("./models/Video");
const userRoutes  = require("./routes/userRoutes");
const videoRoutes = require("./routes/videoRoutes");

const app = express();

// CORS — restrict to frontend URL in production
// CORS — allow main domain + all Vercel preview URLs
const allowedOrigins = [
  process.env.CLIENT_URL,
  /\.vercel\.app$/,
  "http://localhost:5173",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.some((o) =>
      typeof o === "string" ? o === origin : o.test(origin)
    );
    if (allowed) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json({ limit: "1mb" }));
app.disable("x-powered-by");

// Rate limiting — prevent abuse
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requests per window
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const summarizeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,                   // 20 summarize requests per hour per IP
  message: { message: "Summarize limit reached. Please try again in an hour." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

// Health check endpoint — used by hosting providers
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.get("/", (req, res) => res.json({ message: "Notetube API is running" }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/videos/summarize", summarizeLimiter); // extra limit on AI endpoint
app.use("/api/videos", videoRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler — prevents unhandled crashes
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

// Connect DB and start server
const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    console.log("All models synced");

    const PORT = process.env.PORT ?? 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error.message);
    process.exit(1);
  }
};

startServer();