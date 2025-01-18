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
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
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
            videoPath: req.file.path
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
router.post('/award-xu', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Add 100 XU to user's balance
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

module.exports = router;