const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");
const { Video } = require("../models/models");
const { User } = require("../models/models");

// Configure multer for video upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../public/uploads");
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `video-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Not a video file"));
    }
  },
});

// Upload video route (admin only)
router.post("/", auth, upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No video file provided",
      });
    }

    const video = new Video({
      title: req.body.title,
      videoPath: `/uploads/${req.file.filename}`,
    });

    await video.save();

    res.json({
      success: true,
      message: "Video uploaded successfully",
      video,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload video",
    });
  }
});

// Get all videos
router.get("/videos", auth, async (req, res) => {
  try {
    const videos = await Video.find().sort({ uploadDate: -1 });
    res.json({
      success: true,
      videos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch videos",
    });
  }
});

// Award XU after watching video
router.post("/award-xu", auth, async (req, res) => {
  try {
    const { videoId } = req.body;

    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: "Video ID is required",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Ensure rewardedVideos array exists
    if (!user.rewardedVideos) {
      user.rewardedVideos = [];
    }

    // Convert ObjectIds to strings for comparison
    const hasRewarded = user.rewardedVideos.some(
      (id) => id.toString() === videoId.toString()
    );

    if (hasRewarded) {
      return res.status(400).json({
        success: false,
        message: "Already received reward for this video",
      });
    }

    // Add video to rewarded list and update XU
    user.rewardedVideos.push(videoId);
    user.xu = (user.xu || 0) + 100;

    // Save user and handle potential save errors
    try {
      await user.save();

      res.json({
        success: true,
        message: "Gift reward 100 xu",
        newBalance: user.xu,
      });
    } catch (saveError) {
      console.error("Save error:", saveError);
      res.status(500).json({
        success: false,
        message: "Failed to save user data",
      });
    }
  } catch (error) {
    console.error("Award XU error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to award XU",
    });
  }
});

// Add new route to check if video was rewarded
router.get("/check-reward/:videoId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const isRewarded = user.rewardedVideos.includes(req.params.videoId);

    res.json({
      success: true,
      isRewarded,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to check reward status",
    });
  }
});
// Serve video files
router.get("/stream/:filename", auth, (req, res) => {
  const videoPath = path.join(__dirname, "../uploads", req.params.filename);

  // Check if file exists
  if (!fs.existsSync(videoPath)) {
    return res.status(404).json({
      success: false,
      message: "Video not found",
    });
  }

  // Stream the video
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});

// Update video route
router.put("/:id", auth, upload.single("video"), async (req, res) => {
  try {
    const videoId = req.params.id;
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    // Update title
    if (req.body.title) {
      video.title = req.body.title;
    }

    // If new video file is uploaded
    if (req.file) {
      // Delete old video file
      const oldVideoPath = path.join(__dirname, "../public", video.videoPath);
      if (fs.existsSync(oldVideoPath)) {
        fs.unlinkSync(oldVideoPath);
      }

      // Update with new video path
      video.videoPath = `/uploads/${req.file.filename}`;
    }

    await video.save();

    res.json({
      success: true,
      message: "Video updated successfully",
      video,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update video",
    });
  }
});

// Delete video route
router.delete("/:id", auth, async (req, res) => {
  try {
    const videoId = req.params.id;
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    // Delete video file from storage
    const videoPath = path.join(__dirname, "../public", video.videoPath);
    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    }

    // Remove video document from database
    await Video.findByIdAndDelete(videoId);

    res.json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete video",
    });
  }
});

// Get all videos for admin
router.get("/", auth, async (req, res) => {
  try {
    const videos = await Video.find().sort({ uploadDate: -1 });
    res.json(videos); // Trả về trực tiếp mảng videos
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch videos",
    });
  }
});
module.exports = router;
