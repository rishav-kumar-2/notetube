const express = require("express");
const router = express.Router();
const {
  summarizeVideo,
  getUserVideos,
  getVideoById,
  updateNotes,
  deleteVideo,
} = require("../controllers/videoController");
const authenticate = require("../middleware/authMiddleware");

// All video routes are protected
router.use(authenticate);

router.post("/summarize", summarizeVideo);
router.get("/", getUserVideos);
router.get("/:id", getVideoById);
router.patch("/:id/notes", updateNotes);
router.delete("/:id", deleteVideo);

module.exports = router;