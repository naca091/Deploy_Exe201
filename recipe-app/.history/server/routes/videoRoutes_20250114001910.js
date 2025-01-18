const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const { Video } = require('../models/models');
const { User } = require('../models/models');

// Configure multer for video upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../public/uploads');
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `video-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Not a video file'));
        }
    }
});

// Upload video route (admin only)
router.post('/upload', auth, upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No video file provided'
            });
        }

        const video = new Video({
            title: req.body.title,
            videoPath: `/uploads/${req.file.filename}`
        });

        await video.save();

        res.json({
            success: true,
            message: 'Video uploaded successfully',
            video
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload video'
        });
    }
});

// Get all videos
router.get('/videos', auth, async (req, res) => {
    try {
        const videos = await Video.find().sort({ uploadDate: -1 });
        res.json({
            success: true,
            videos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch videos'
        });
    }
});

// Award XU after watching video
// Award XU after watching video
router.post('/award-xu', auth, async (req, res) => {
    try {
        const { videoId } = req.body; // Add videoId to request body
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user has already received reward for this video
        if (user.rewardedVideos.includes(videoId)) {
            return res.status(400).json({
                success: false,
                message: 'Already received reward for this video'
            });
        }

        // Add video to rewarded list and update XU
        user.rewardedVideos.push(videoId);
        user.xu = (user.xu || 0) + 100;
        await user.save();

        res.json({
            success: true,
            message: 'Gift reward 100 xu',
            newBalance: user.xu
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to award XU'
        });
    }
});

// Add new route to check if video was rewarded
router.get('/check-reward/:videoId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const isRewarded = user.rewardedVideos.includes(req.params.videoId);
        
        res.json({
            success: true,
            isRewarded
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to check reward status'
        });
    }
});
// Serve video files
router.get('/stream/:filename', auth, (req, res) => {
    const videoPath = path.join(__dirname, '../uploads', req.params.filename);
    
    // Check if file exists
    if (!fs.existsSync(videoPath)) {
        return res.status(404).json({
            success: false,
            message: 'Video not found'
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
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
    }
});
module.exports = router;