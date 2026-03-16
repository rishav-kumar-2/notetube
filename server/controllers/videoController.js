const Groq  = require("groq-sdk");
const axios = require("axios");
const Video = require("../models/Video");

// Init Groq — get your free key at console.groq.com
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY?.trim() });

// --- Helpers ---

function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    /(?:youtu\.be\/)([^&\n?#]+)/,
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
    /(?:youtube\.com\/live\/)([^&\n?#]+)/,       // YouTube Live URLs
    /(?:youtube\.com\/shorts\/)([^&\n?#]+)/,      // YouTube Shorts
    /(?:youtube\.com\/v\/)([^&\n?#]+)/,           // Old embed format
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

async function fetchMetadata(videoId) {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return {
      title:     data.title,
      channel:   data.author_name,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    };
  } catch {
    return null;
  }
}

async function fetchTranscript(videoId) {
  const res = await axios.get(
    `https://api.supadata.ai/v1/youtube/transcript`,
    {
      params:  { videoId, text: true },
      headers: { "x-api-key": process.env.SUPADATA_API_KEY },
    }
  );

  if (!res.data || !res.data.content) {
    throw new Error("No transcript found for this video");
  }

  return {
    text:     res.data.content,
    language: res.data.lang || "en",
  };
}

async function summarizeWithGroq(transcript, title, language = "en") {
  const prompt = `You are an expert note-taking assistant that creates detailed, structured summaries of YouTube videos.

Video Title: "${title || "Unknown"}"
Transcript Language: "${language}"

${language !== "en" ? "The transcript below is not in English. Please translate it and summarize everything in English." : ""}

Transcript:
${transcript.slice(0, 12000)}

First, determine if this video is educational/study content (programming tutorials, science, math, history, language learning, lectures, courses, how-to guides, etc.) or non-educational (entertainment, vlogs, music, comedy, news, etc.).

Then provide:

1. "isEducational": true or false
2. "summary": A detailed overview (5-8 sentences) covering the main message, context, and conclusions
3. "keyPoints": 8-12 key takeaways — each a full sentence, not just a phrase
4. "topics": If isEducational is TRUE — identify 3-6 main topics taught in the video. For each topic provide:
   - "title": the topic name
   - "summary": 2-4 sentences explaining what was taught
   - "notes": 3-6 bullet point notes extracted directly from the video content for that topic (specific facts, code concepts, formulas, definitions, examples mentioned)
   
   If isEducational is FALSE — still identify 3-6 main topics but without the notes array (just title and summary).

Format your response as JSON only — no markdown, no explanation, just raw JSON. IMPORTANT: every string value MUST be wrapped in double quotes. Do not leave any string value unquoted:
{
  "isEducational": true,
  "summary": "Detailed overview here...",
  "keyPoints": ["point 1", "point 2"],
  "topics": [
    {
      "title": "Topic name",
      "summary": "What was taught in this topic...",
      "notes": ["Specific note 1", "Specific note 2", "Specific note 3"]
    }
  ]
}`;

  const completion = await groq.chat.completions.create({
    model:       "llama-3.3-70b-versatile",
    messages:    [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens:  2500,
  });

  const text = completion.choices[0]?.message?.content ?? "";

  // Strip markdown code fences if present
  const clean = text.replace(/```json|```/g, "").trim();

  // Try direct parse first
  try {
    const parsed = JSON.parse(clean);
    return parsed;
  } catch (e) {
    // fallthrough to regex extraction
  }

  // Fallback: extract each field individually using regex
  try {
    const getBool   = (key) => new RegExp(`"${key}"\\s*:\\s*(true|false)`).exec(clean)?.[1] === "true";
    const getString = (key) => {
      const quoted = new RegExp(`"${key}"\\s*:\\s*"([^"]*(?:\\"[^"]*)*)"`, "s").exec(clean)?.[1];
      if (quoted) return quoted;
      const unquoted = new RegExp(`"${key}"\\s*:\\s*([^"\\[{][^,}\\]]*?)(?=,\\s*"|\\s*})`, "s").exec(clean)?.[1];
      return unquoted?.trim() ?? "";
    };
    const getArray  = (key) => {
      const match = new RegExp(`"${key}"\\s*:\\s*(\\[[\\s\\S]*?\\])`, "s").exec(clean)?.[1];
      if (!match) return [];
      try { return JSON.parse(match); } catch { return []; }
    };
    const getTopics = () => {
      const match = /"topics"\s*:\s*(\[\s*\{[\s\S]*?\}\s*\])/s.exec(clean)?.[1];
      if (!match) return [];
      try { return JSON.parse(match); } catch { return []; }
    };

    return {
      isEducational: getBool("isEducational"),
      summary:       getString("summary"),
      keyPoints:     getArray("keyPoints"),
      topics:        getTopics(),
    };
  } catch (e2) {
    console.error("Field extraction failed:", e2.message);
    return { isEducational: false, summary: clean, keyPoints: [], topics: [] };
  }
}

// --- Guard helper ---
// Handles JWT signed with either { id } or { userId }
function getUserId(req) {
  return req.user?.id ?? req.user?.userId ?? null;
}

// --- Controllers ---

exports.summarizeVideo = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: user ID missing from token" });
  }

  const videoId = extractVideoId(url);
  if (!videoId) {
    return res.status(400).json({ message: "Invalid YouTube URL" });
  }

  try {
    const { text: transcript, language } = await fetchTranscript(videoId);
    const meta = await fetchMetadata(videoId);
    const { summary, keyPoints, topics, isEducational } = await summarizeWithGroq(
      transcript,
      meta?.title,
      language
    );

    const video = await Video.create({
      url,
      videoId,
      title:         meta?.title     || null,
      channel:       meta?.channel   || null,
      thumbnail:     meta?.thumbnail || null,
      transcript,
      summary,
      keyPoints,
      topics,
      isEducational: isEducational ?? false,
      userId,
    });

    res.status(201).json({ message: "Video summarized successfully", video });
  } catch (err) {
    console.error("summarizeVideo error:", err.message);
    res.status(500).json({ message: "Failed to summarize video", detail: err.message });
  }
};

exports.getUserVideos = async (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: user ID missing from token" });
  }
  try {
    const videos = await Video.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
    res.json(videos);
  } catch (err) {
    console.error("getUserVideos error:", err.message);
    res.status(500).json({ message: "Failed to fetch videos", detail: err.message });
  }
};

exports.getVideoById = async (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: user ID missing from token" });
  }
  try {
    const video = await Video.findOne({
      where: { id: req.params.id, userId },
    });
    if (!video) return res.status(404).json({ message: "Video not found" });
    res.json(video);
  } catch (err) {
    console.error("getVideoById error:", err.message);
    res.status(500).json({ message: "Failed to fetch video", detail: err.message });
  }
};

exports.updateNotes = async (req, res) => {
  const { notes } = req.body;
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: user ID missing from token" });
  }
  try {
    const video = await Video.findOne({
      where: { id: req.params.id, userId },
    });
    if (!video) return res.status(404).json({ message: "Video not found" });

    video.notes = notes ?? "";
    await video.save();

    res.json({ message: "Notes updated", video });
  } catch (err) {
    console.error("updateNotes error:", err.message);
    res.status(500).json({ message: "Failed to update notes", detail: err.message });
  }
};

exports.deleteVideo = async (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: user ID missing from token" });
  }
  try {
    const video = await Video.findOne({
      where: { id: req.params.id, userId },
    });
    if (!video) return res.status(404).json({ message: "Video not found" });

    await video.destroy();
    res.json({ message: "Video deleted successfully" });
  } catch (err) {
    console.error("deleteVideo error:", err.message);
    res.status(500).json({ message: "Failed to delete video", detail: err.message });
  }
};