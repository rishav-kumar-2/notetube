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
app.set("trust proxy", 1);

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const summarizeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { message: "Summarize limit reached. Please try again in an hour." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.get("/", (req, res) => res.json({ message: "Notetube API is running" }));

app.use("/api/users", userRoutes);
app.use("/api/videos/summarize", summarizeLimiter);
app.use("/api/videos", videoRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    console.log("All models synced");

    const PORT = process.env.PORT ?? 8080;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error.message);
    process.exit(1);
  }
};

startServer();